from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'type']
        read_only_fields = ['id']


class TransactionSerializer(serializers.ModelSerializer):
    categoryId = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
    )

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'type', 'categoryId', 'date', 'note']
        read_only_fields = ['id']

    def validate_categoryId(self, value):
        """Make sure users can't assign someone else's category to their transaction."""
        request = self.context.get('request')
        if request and value.user != request.user:
            raise serializers.ValidationError('Category does not belong to you.')
        return value


class BudgetSerializer(serializers.ModelSerializer):
    categoryId = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.all(),
    )

    class Meta:
        model = Budget
        fields = ['id', 'categoryId', 'amount', 'period']
        read_only_fields = ['id']

    def validate_categoryId(self, value):
        """Make sure users can't assign someone else's category to their budget."""
        request = self.context.get('request')
        if request and value.user != request.user:
            raise serializers.ValidationError('Category does not belong to you.')
        return value


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(max_length=150, required=False, default='')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered.')
        return value

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=name,
        )
        return user