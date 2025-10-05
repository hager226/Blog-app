const API_URL = 'https://blog-app-api-production-8fde.up.railway.app';

export const login = async (userData) => {
  try {
    console.log("🔄 Attempting login...");
    
    const response = await fetch(`${API_URL}/users?email=${userData.email}`);
    const users = await response.json();
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    
    if (user.password !== userData.password) {
      throw new Error('Invalid password');
    }
    
    console.log("✅ Login successful:", user);
    
    const fakeToken = 'token-' + Date.now();
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { 
      accessToken: fakeToken, 
      user 
    };
    
  } catch (error) {
    console.error('🔥 Login error:', error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log("🔄 Attempting registration...");
    
    const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
    const existingUsers = await checkResponse.json();
    
    if (existingUsers.length > 0) {
      throw new Error('Email already exists');
    }
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        id: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const user = await response.json();
    console.log("✅ Registration successful:", user);
    
    const fakeToken = 'token-' + Date.now();
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { 
      accessToken: fakeToken, 
      user 
    };
    
  } catch (error) {
    console.error('🔥 Register error:', error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log("🚪 User logged out");
};