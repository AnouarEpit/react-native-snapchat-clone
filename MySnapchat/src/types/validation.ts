export const validateEmail = (email: string): boolean => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {

    return password.length >= 6;
  };
  
  export const validateUsername = (username: string): boolean => {
    
    return username.length >= 3 && username.length <= 20;
  
};
  
  export const validateForm = {
 
    email: (email: string) => {
      
      if (!email) return 'Email requerido';
 
      if (!validateEmail(email)) return 'Email inválido';
 
      return null;
    },
    
    password: (password: string) => {
 
      if (!password) return 'Contraseña requerida';
 
      if (!validatePassword(password)) return 'Mínimo 6 caracteres';
 
      return null;
    },
    
    username: (username: string) => {
 
      if (!username) return 'Username requerido';
  
      if (!validateUsername(username)) return '3-20 caracteres';

      return null;
    },
  };
  