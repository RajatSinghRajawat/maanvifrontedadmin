import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Checkbox, Typography } from 'antd';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onFinish = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <Typography.Title level={2} className="!mb-1 text-indigo-600">
            Mannvi Admin
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to your account</Typography.Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: 'Please enter email' }]}
          >
            <Input prefix={<FiMail />} placeholder="admin@mannvi.com" size="large" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input
              prefix={<FiLock />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              size="large"
              suffix={
                <Button
                  type="text"
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword((p) => !p)}
                />
              }
            />
          </Form.Item>
          <div className="flex items-center justify-between mb-4">
            <Checkbox>Remember me</Checkbox>
            <Button type="link" className="p-0">
              Forgot password?
            </Button>
          </div>
          <Button type="primary" htmlType="submit" block size="large">
            Sign In
          </Button>
        </Form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Button type="link" className="p-0">
            Contact Administrator
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
