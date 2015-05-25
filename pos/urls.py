from django.conf.urls import patterns, include, url
import settings

from django.contrib import admin
admin.autodiscover()

from rest_framework import routers
import pos.views as views

#from pos.backend import Backend as pos_login

router = routers.DefaultRouter()
router.register(r'api/employees', views.EmployeeViewSet)
router.register(r'api/users', views.UserViewSet)
router.register(r'api/groups', views.GroupViewSet)
router.register(r'api/tables', views.TableViewSet)
router.register(r'api/categories', views.CategoryViewSet)
router.register(r'api/products', views.ProductViewSet)
router.register(r'api/orders', views.OrderViewSet)
router.register(r'api/orderitems', views.OrderItemViewSet)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'pos.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^pos/', views.pos, name='pos'),
    url(r'^test_app/', views.test_app, name='test_app'),

    url(r'^auth/', views.auth, name='auth'),

    url(r'^pos-op/', views.pos_op, name='pos-op'),
    url(r'^kitchen/', views.kitchen, name='kitchen'),
    url(r'^skara/', views.skara, name='skara'),
    url(r'^bar/', views.bar, name='bar'),

    url(r'^admin/report/', views.report, name='report'),
    url(r'^admin/report-csv/', views.report_csv, name='report_csv'),
    url(r'^report-service/', views.report_service, name='report_service'),
    url(r'^report-waiter/', views.report_waiter, name='report_waiter'),
    url(r'^report_all/', views.report_all, name="report_all"),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT, 'show_indexes': True}),
#    url(r'^pos_login/', pos_login.authenticate, name="pos_login"),
)
