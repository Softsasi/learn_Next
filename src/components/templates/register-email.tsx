
interface RegisterEmailTemplateProps {
  firstName: string;
  email: string;
  verificationLink: string;
}

const RegisterEmailTemplate = ({
  firstName,
  email,
  verificationLink,
}: RegisterEmailTemplateProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f5f5f5',
        margin: 0,
        padding: 0,
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '20px auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            textAlign: 'center' as const,
          }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              🎓 Welcome to LearnHub!
            </h1>
          </div>

          {/* Content */}
          <div style={{ padding: '40px 30px' }}>
            <div style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '20px',
            }}>
              Hi {firstName},
            </div>

            <div style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px',
              fontSize: '14px',
            }}>
              Thank you for creating an account with LearnHub! We're excited to have you join our learning community.
            </div>

            <div style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px',
              fontSize: '14px',
            }}>
              To complete your registration and unlock all features, please verify your email address by clicking the button below:
            </div>

            <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
              <a href={verificationLink} style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px 40px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '16px',
              }}>
                ✓ Verify Email Address
              </a>
            </div>

            <div style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px',
              fontSize: '14px',
            }}>
              Or copy and paste this link in your browser:
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #667eea',
              padding: '20px',
              margin: '20px 0',
              borderRadius: '4px',
              wordBreak: 'break-all' as const,
              fontSize: '12px',
              color: '#666',
            }}>
              {verificationLink}
            </div>

            <hr style={{
              border: 'none',
              borderTop: '1px solid #e0e0e0',
              margin: '30px 0',
            }} />

            <div style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px',
              fontSize: '14px',
            }}>
              <strong>What happens next?</strong>
              <br />
              Once you verify your email, you'll be able to:
              <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                <li>Access all course materials</li>
                <li>Participate in discussions</li>
                <li>Track your learning progress</li>
                <li>Connect with other learners</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              padding: '15px',
              margin: '20px 0',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#856404',
            }}>
              <strong>⏱️ Verification Link Expires:</strong> This link will expire in 24 hours. If it expires, you can request a new verification email from your account settings.
            </div>

            <div style={{
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px',
              fontSize: '14px',
            }}>
              <strong>Didn't create this account?</strong>
              <br />
              If you didn't sign up for a LearnHub account, please ignore this email or contact our support team.
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px 30px',
            textAlign: 'center' as const,
            borderTop: '1px solid #e0e0e0',
            fontSize: '12px',
            color: '#999',
          }}>
            <p>
              © 2025 LearnHub. All rights reserved.
              <br />
              <a href="https://learnhub.com/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>
                Privacy Policy
              </a>
              {' | '}
              <a href="https://learnhub.com/terms" style={{ color: '#667eea', textDecoration: 'none' }}>
                Terms of Service
              </a>
            </p>
            <p>
              Questions? Contact us at
              <a href="mailto:support@learnhub.com" style={{ color: '#667eea', textDecoration: 'none' }}>
                {' '}support@learnhub.com
              </a>
            </p>
            <p>
              Email sent to: <strong>{email}</strong>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RegisterEmailTemplate;
