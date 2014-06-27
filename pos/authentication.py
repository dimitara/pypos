from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions

class POSAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth = authentication.get_authorization_header(request).split()
        print auth
        username = request.META.get('X_USERNAME')
        
        raise exceptions.AuthenticationFailed
        
        #print username
        if not username:
            return None

        try:
            user = User.objects.get(username=username)
            print user
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, None)

    def authenticate_header(self, request):
        pass    

class BasicAuthentication(authentication.BaseAuthentication):
    """
    HTTP Basic authentication against username/password.
    """
    www_authenticate_realm = 'api'

    def authenticate(self, request):
        print "Here"
        """
        Returns a `User` if a correct username and password have been supplied
        using HTTP Basic authentication.  Otherwise returns `None`.
        """
        auth = authentication.get_authorization_header(request).split()

        if not auth or auth[0].lower() != b'basic':
            return None

        if len(auth) == 1:
            msg = 'Invalid basic header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid basic header. Credentials string should not contain spaces.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            auth_parts = base64.b64decode(auth[1]).decode(HTTP_HEADER_ENCODING).partition(':')
        except (TypeError, UnicodeDecodeError):
            msg = 'Invalid basic header. Credentials not correctly base64 encoded'
            raise exceptions.AuthenticationFailed(msg)

        userid, password = auth_parts[0], auth_parts[2]
        return self.authenticate_credentials(userid, password)

    def authenticate_credentials(self, userid, password):
        """
        Authenticate the userid and password against username and password.
        """
        user = authenticate(username=userid, password=password)
        if user is None or not user.is_active:
            raise exceptions.AuthenticationFailed('Invalid username/password')
        return (user, None)

    def authenticate_header(self, request):
        return 'Basic realm="%s"' % self.www_authenticate_realm
