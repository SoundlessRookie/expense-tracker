from django.shortcuts import render
import boto3
import json
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget
from .serializers import (
    CategorySerializer,
    TransactionSerializer,
    BudgetSerializer,
    UserRegistrationSerializer,
)


DEFAULT_CATEGORIES = [
    {'name': 'Food & Dining', 'icon': '🍜', 'color': '#FB923C', 'type': 'expense'},
    {'name': 'Groceries', 'icon': '🛒', 'color': '#10B981', 'type': 'expense'},
    {'name': 'Transportation', 'icon': '🚗', 'color': '#3B82F6', 'type': 'expense'},
    {'name': 'Shopping', 'icon': '🛍️', 'color': '#EC4899', 'type': 'expense'},
    {'name': 'Entertainment', 'icon': '🎮', 'color': '#8B5CF6', 'type': 'expense'},
    {'name': 'Health & Fitness', 'icon': '💪', 'color': '#10B981', 'type': 'expense'},
    {'name': 'Home & Garden', 'icon': '🏡', 'color': '#F59E0B', 'type': 'expense'},
    {'name': 'Bills & Utilities', 'icon': '💡', 'color': '#EAB308', 'type': 'expense'},
    {'name': 'Pets', 'icon': '🐾', 'color': '#F97316', 'type': 'expense'},
    {'name': 'Education', 'icon': '📚', 'color': '#6366F1', 'type': 'expense'},
    {'name': 'Travel & Vacation', 'icon': '✈️', 'color': '#06B6D4', 'type': 'expense'},
    {'name': 'Salary', 'icon': '💰', 'color': '#10B981', 'type': 'income'},
    {'name': 'Investment', 'icon': '📈', 'color': '#3B82F6', 'type': 'income'},
    {'name': 'Gifts Received', 'icon': '🎉', 'color': '#EC4899', 'type': 'income'},
    {'name': 'Bonus & Rewards', 'icon': '🎯', 'color': '#F59E0B', 'type': 'income'},
    {'name': 'Other Income', 'icon': '✨', 'color': '#A855F7', 'type': 'income'},
]


def seed_default_categories(user):
    categories = [Category(user=user, **data) for data in DEFAULT_CATEGORIES]
    Category.objects.bulk_create(categories)


# Auth Views (function-based)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):

    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    seed_default_categories(user)

    token = Token.objects.create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'name': user.first_name or user.username,
            'email': user.email,
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):

    username = request.data.get('username', '')
    password = request.data.get('password', '')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'name': user.first_name or user.username,
            'email': user.email,
        }
    })


@api_view(['POST'])
def logout(request):

    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
def me(request):

    return Response({
        'user': {
            'name': request.user.first_name or request.user.username,
            'email': request.user.email,
        }
    })

@api_view(['POST'])
def export_data(request):
    """
    POST /api/export/
    Invokes the data export Lambda and returns the download URL.
    """
    lambda_client = boto3.client('lambda', region_name='us-east-1')

    response = lambda_client.invoke(
        FunctionName='expense-tracker-data-export',
        InvocationType='RequestResponse',
        Payload=json.dumps({'email': request.user.email}),
    )

    result = json.loads(response['Payload'].read())
    body = json.loads(result.get('body', '{}'))

    return Response(body)

@api_view(['POST'])
def get_upload_url(request):
    s3_client = boto3.client('s3', region_name='us-east-1')

    # Build the S3 key using the user's email
    email = request.user.email
    safe_email = email.replace('@', '_at_').replace('.', '_dot_')
    filename = request.data.get('filename', 'receipt.jpg')
    key = f"receipts/{safe_email}/{filename}"

    # Generate pre-signed upload URL (expires in 5 minutes)
    upload_url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': 'YOUR_S3_BUCKET_NAME',
            'Key': key,
            'ContentType': 'image/jpeg',
        },
        ExpiresIn=300,
    )

    return Response({
        'upload_url': upload_url,
        'key': key,
    })


# CRUD ViewSets
class CategoryViewSet(viewsets.ModelViewSet):
    """
    Automatically provides:
      GET    /api/categories/       
      POST   /api/categories/       
      GET    /api/categories/{id}/  
      PUT    /api/categories/{id}/  
      DELETE /api/categories/{id}/  
    """
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
  
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)

        # Filter by type
        tx_type = self.request.query_params.get('type')
        if tx_type in ('income', 'expense'):
            qs = qs.filter(type=tx_type)

        # Filter by month (format: 'YYYY-MM')
        month = self.request.query_params.get('month')
        if month:
            try:
                year, mo = month.split('-')
                qs = qs.filter(date__year=int(year), date__month=int(mo))
            except (ValueError, IndexError):
                pass

        # Search notes and category names
        search = self.request.query_params.get('search')
        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(note__icontains=search) |
                Q(category__name__icontains=search)
            )

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
 
    serializer_class = BudgetSerializer

    def get_queryset(self):
        qs = Budget.objects.filter(user=self.request.user)

        period = self.request.query_params.get('period')
        if period:
            qs = qs.filter(period=period)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

