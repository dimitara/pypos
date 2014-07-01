from django.conf.urls import patterns, include, url
import settings

from django.contrib import admin
admin.autodiscover()

from rest_framework import routers
import pos.views as views

#from pos.backend import Backend as pos_login

router = routers.DefaultRouter()
router.register(r'employees', views.EmployeeViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'tables', views.TableViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'orderitem', views.OrderItemViewSet)

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
    url(r'^admin/report-service/', views.report, name='report'),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT, 'show_indexes': True}),
#    url(r'^pos_login/', pos_login.authenticate, name="pos_login"),
)
