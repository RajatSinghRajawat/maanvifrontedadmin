import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Checkbox, Typography } from 'antd';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { api } from '../services/api';
import { toast } from '../utils/toast';
import Logo from './Logo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.login({
        email: values.email,
        password: values.password,
      });

      // Store token and admin info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      localStorage.setItem('isAuthenticated', 'true');

      toast.success('Login successful', `Welcome back, ${res.data.admin.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login failed', err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <Typography.Title level={2} className="!mb-1 text-indigo-600">
            Admin Panel
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
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
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
