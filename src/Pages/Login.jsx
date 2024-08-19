// // src/Login.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import Navbar from '../Components/Navbar'

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleLogin = async () => {
//     try {
//       await axios.post('http://localhost:3000/login', { username, password });
//       setMessage('User logged in successfully');
//     } catch (error) {
//       console.error('Login error:', error.response?.data?.error || error.message);
//       setMessage(`Error: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Login</h3>
//               </div>
//               <div className="card-body">
//                 <form>
//                   <div className="form-group">
//                     <label htmlFor="username">Username</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="username"
//                       placeholder="Enter username"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       id="password"
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </div>
//                   <button type="button" className="btn btn-primary mt-3" onClick={handleLogin}>
//                     Login
//                   </button>
//                 </form>
//                 {message && <div className="alert alert-info mt-3">{message}</div>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar'
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://jf33t90jbi.execute-api.eu-north-1.amazonaws.com/dev/login', { 
        username, 
        password 
      });
      setMessage(response.data.message);
      toast.success("You are logged in!");

      localStorage.setItem('loggedInUser', JSON.stringify({
        username: username,
        loggedInAt: new Date().toISOString()
        // Add more details as needed
      }));
      setTimeout(() => navigate('/chat'), 2000);

    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Login</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="button" className="btn btn-primary mt-3" onClick={handleLogin}>
                    Login
                  </button>
                </form>
                {message && <div className="alert alert-success mt-3">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default Login;
