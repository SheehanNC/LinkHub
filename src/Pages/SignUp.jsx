// // src/SignUp.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import Navbar from '../Components/Navbar';

// const SignUp = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSignUp = async () => {
//     try {
//       await axios.post('http://localhost:3000/signup', { username, password });
//       setMessage('User registered successfully');
//     } catch (error) {
//       console.error('Sign-up error:', error.response?.data?.error || error.message);
//       setMessage(`Error: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   return (
//     <div>
//     <Navbar/>
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card">
//             <div className="card-header">
//               <h3>Sign Up</h3>
//             </div>
//             <div className="card-body">
//               <form>
//               <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="username"
//                     placeholder="Enter email"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="username">Username</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="username"
//                     placeholder="Enter username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>
//                 <button type="button" className="btn btn-primary mt-3" onClick={handleSignUp}>
//                   Sign Up
//                 </button>
//               </form>
//               {message && <div className="alert alert-info mt-3">{message}</div>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default SignUp;


// src/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; 


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await axios.post('https://jf33t90jbi.execute-api.eu-north-1.amazonaws.com/dev/signup', { username, password, email });
      setMessage('User registered successfully');

      toast.success("Account successfully created!");

      localStorage.setItem('loggedInUser', JSON.stringify({
        username: username,
        loggedInAt: new Date().toISOString()
        // Add more details as needed
      }));
      
      setTimeout(() => navigate('/chat'), 2000);

    } catch (error) {
      console.error('Sign-up error:', error.response?.data?.error || error.message);
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Sign Up</h3>
              </div>
              <div className="card-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
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
                  <button type="button" className="btn btn-primary mt-3" onClick={handleSignUp}>
                    Sign Up
                  </button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SignUp;
