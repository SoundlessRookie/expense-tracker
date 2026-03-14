from django.db import models
from django.conf import settings
import uuid

# Create your models here.

class Category(models.Model):

    class CategoryType(models.TextChoices):
        INCOME = 'income', 'Income'
        EXPENSE = 'expense', 'Expense'

    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10)
    color = models.CharField(max_length=7)
    type = models.CharField(
        max_length=7,
        choices=CategoryType.choices,
    )

    class Meta:
        verbose_name_plural = 'categories'
        ordering =['name']

    def __str__(self):
        return f'{self.icon} {self.name}'
    

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        INCOME = 'income', 'Income'
        EXPENSE = 'expense', 'Expense'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(
        max_length=7,
        choices=TransactionType.choices
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='transactions',
    )
    date = models.DateField()
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        sign = '+' if self.type == 'income' else '-'
        return f'{sign}${self.amout} on {self.date}'
    
class Budget(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4,
        editable=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='budgets',
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    period = models.CharField(max_length=7)  

    class Meta:
        unique_together = ['user', 'category', 'period']
        ordering = ['-period']

    def __str__(self):
        return f'${self.amount} budget for {self.category.name} ({self.period})'
