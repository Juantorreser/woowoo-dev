
// // src/pages/admin-account-search.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Table,
//   Button,
// } from 'react-bootstrap';
// import {
//   Box,
//   CssBaseline,
//   makeStyles,
//   TextField,
// } from '@material-ui/core';
// import globalStyles from './globalStyling.module.css';

// const useStyles = makeStyles((theme) => ({
//   searchContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: theme.spacing(2, 0),
//   },
//   searchInput: {
//     marginRight: theme.spacing(2),
//     width: '50%',
//   },
//   buttonContainer: {
//     margin: theme.spacing(2, 0),
//     display: 'flex',
//     justifyContent: 'center',
//   },
// }));

// const AdminAccountSearch = () => {
//   const classes = useStyles();
//   const [users, setUsers] = useState([]);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:8080/users')
//       .then(response => {
//         setUsers(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the users!', error);
//       });
//   }, []);

//   const handleSearch = (event) => {
//     event.preventDefault();
//     const searchQuery = event.target.elements.input.value;
//     setQuery(searchQuery);

//     // Check if the search query is a number (user ID)
//     if (!isNaN(searchQuery) && searchQuery.trim() !== '') {
//       // Fetch user by ID
//       axios.get(`http://localhost:8080/users/${searchQuery}`)
//         .then(response => {
//           setUsers([response.data]); // Put the single user in an array
//         })
//         .catch(error => {
//           console.error('There was an error fetching the user!', error);
//           setUsers([]); // Clear users on error
//         });
//     } else {
//       // Handle general search (e.g., by name)
//       axios.get(`http://localhost:8080/users?search=${searchQuery}`)
//         .then(response => {
//           setUsers(response.data);
//         })
//         .catch(error => {
//           console.error('There was an error fetching the users!', error);
//           setUsers([]); // Clear users on error
//         });
//     }
//   };

//   const toggleStatus = (userId, currentStatus) => {
//     // Update user status (enable/disable)
//     const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
//     axios.patch(`http://localhost:8080/users/${userId}`, { status: newStatus })
//       .then(() => {
//         setUsers(prevUsers => prevUsers.map(user => user.uid === userId ? { ...user, status: newStatus } : user));
//       })
//       .catch(error => {
//         console.error('There was an error updating the user status!', error);
//       });
//   };

//   const handleRegisterNewUser = () => {
//     // Navigate to the registration page
//     window.location.href = '/register'
//   };
//   const handleManageUser = (userId) => {
//     // Navigate to the user management page
//     window.location.href = `/manage-user/${userId}`;
//   };
  

//   return (
//     <Container style={{ textAlign: 'center' }}>
//       <CssBaseline />
//       <Box className={classes.searchContainer}>
//         <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
//           <TextField
//             type="text"
//             id="header-search"
//             placeholder="Search Users By Name or User ID"
//             name="input"
//             variant="outlined"
//             size="small"
//             className={classes.searchInput}
//             fullWidth
//           />
//           <Button type="submit" variant="primary">
//             Search
//           </Button>
//         </form>
//       </Box>
//       <Box className={classes.buttonContainer}>
//         <Button
//           variant="success"
//           onClick={handleRegisterNewUser}
//         >
//           Register New User
//         </Button>
//       </Box>
//       {/* <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>User ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.firstName} {user.lastName}</td>
//               <td>{user.email}</td>
//               <td>{user.status}</td>
//               <td>
//                 <Button
//                   variant={user.status === 'enabled' ? 'danger' : 'success'}
//                   onClick={() => toggleStatus(user.id, user.status)}
//                 >
//                   {user.status === 'enabled' ? 'Disable' : 'Enable'}
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table> */}
//       <Table striped bordered hover>
//   <thead>
//     <tr>
//       <th>User ID</th>
//       <th>Name</th>
//       <th>Email</th>
//       <th>Status</th>
//       <th>Actions</th>
//       <th>Manage</th> {/* New column header */}
//     </tr>
//   </thead>
//   <tbody>
//     {users.map(user => (
//       <tr key={user.id}>
//         <td>{user.uid}</td>
//         <td>{user.firstName} {user.lastName}</td>
//         <td>{user.email}</td>
//         <td>{user.status}</td>
//         <td>
//           <Button
//             variant={user.status === 'enabled' ? 'danger' : 'success'}
//             onClick={() => toggleStatus(user.uid, user.status)}
//           >
//             {user.status === 'enabled' ? 'Disable' : 'Enable'}
//           </Button>
//         </td>
//         <td>
//           <Button
//             variant="info"
//             onClick={() => handleManageUser(user.uid)}
//           >
//             Manage
//           </Button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </Table>

//     </Container>
//   );
// }

// export default AdminAccountSearch;

//---------------------------------------------------------------------------------------------------


// // src/pages/AdminAccountSearch.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Table,
//   Button,
// } from 'react-bootstrap';
// import {
//   Box,
//   CssBaseline,
//   makeStyles,
//   TextField,
// } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   searchContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: theme.spacing(2, 0),
//   },
//   searchInput: {
//     marginRight: theme.spacing(2),
//     width: '50%',
//   },
//   buttonContainer: {
//     margin: theme.spacing(2, 0),
//     display: 'flex',
//     justifyContent: 'center',
//   },
// }));

// const AdminAccountSearch = () => {
//   const classes = useStyles();
//   const [users, setUsers] = useState([]);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:8080/users')
//       .then(response => {
//         setUsers(response.data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the users!', error);
//       });
//   }, []);

//   const handleSearch = async (event) => {
//     event.preventDefault();
//     const searchQuery = event.target.elements.input.value.trim();
//     setQuery(searchQuery);

//     try {
//       if (!isNaN(searchQuery) && searchQuery !== '') {
//         const { data } = await axios.get(`http://localhost:8080/users/${searchQuery}`);
//         setUsers([data]);
//       } else {
//         const { data } = await axios.get(`http://localhost:8080/users?search=${searchQuery}`);
//         setUsers(data);
//       }
//     } catch (error) {
//       console.error('There was an error fetching the users!', error);
//       setUsers([]);
//     }
//   };

//   const toggleStatus = async (userId, currentStatus) => {
//     const newStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
//     try {
//       await axios.patch(`http://localhost:8080/users/${userId}`, { status: newStatus });
//       setUsers(prevUsers => prevUsers.map(user => user.uid === userId ? { ...user, status: newStatus } : user));
//     } catch (error) {
//       console.error('There was an error updating the user status!', error);
//     }
//   };

//   const handleRegisterNewUser = () => {
//     window.location.href = '/register';
//   };

//   const handleManageUser = (userId) => {
//     if (userId) {
//       window.location.href = `/manage-user/${userId}`;
//     } else {
//       console.error('Invalid user ID');
//     }
//   };

//   const handleDelete = async (userId) => {
//     try {
//       await axios.delete(`http://localhost:8080/users/${userId}`);
//       setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId));
//     } catch (error) {
//       console.error('There was an error deleting the user!', error);
//     }
//   };

//   return (
//     <Container style={{ textAlign: 'center' }}>
//       <CssBaseline />
//       <Box className={classes.searchContainer}>
//         <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
//           <TextField
//             type="text"
//             id="header-search"
//             placeholder="Search Users By Name or User ID"
//             name="input"
//             variant="outlined"
//             size="small"
//             className={classes.searchInput}
//             fullWidth
//           />
//           <Button type="submit" variant="primary">
//             Search
//           </Button>
//         </form>
//       </Box>
//       <Box className={classes.buttonContainer}>
//         <Button variant="success" onClick={handleRegisterNewUser}>
//           Register New User
//         </Button>
//       </Box>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>User ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Actions</th>
//             <th>Manage</th>
//             <th>Delete</th> {/* New column header */}
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user.uid}>
//               <td>{user.uid}</td>
//               <td>{user.firstName} {user.lastName}</td>
//               <td>{user.email}</td>
//               <td>{user.status}</td>
//               <td>
//                 <Button
//                   variant={user.status === 'enabled' ? 'danger' : 'success'}
//                   onClick={() => toggleStatus(user.uid, user.status)}
//                 >
//                   {user.status === 'enabled' ? 'Disable' : 'Enable'}
//                 </Button>
//               </td>
//               <td>
//                 <Button
//                   variant="info"
//                   onClick={() => handleManageUser(user.uid)}
//                 >
//                   Manage
//                 </Button>
//               </td>
//               <td>
//                 <Button
//                   variant="danger"
//                   onClick={() => handleDelete(user.uid)}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </Container>
//   );
// };

// export default AdminAccountSearch;

//-----------------------------------------------------------------------------
import { app } from '../firebase/firebase-config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential } from 'firebase/auth';

import {
  Container,
  Table,
  Button,
} from 'react-bootstrap';
import {
  Box,
  CssBaseline,
  makeStyles,
  TextField,
} from '@material-ui/core';

const firebaseConfig  ={
  apiKey: "AIzaSyBHgWrdxrNW0tcheACV45rzou5b4jIZmC4",
  authDomain: "woo-woo-network.firebaseapp.com",
  projectId: "woo-woo-network",
  storageBucket: "woo-woo-network.appspot.com",
  messagingSenderId: "257418938856",
  appId: "1:257418938856:web:6319ea7393e05ae3107c5d",
  measurementId: "G-XNZR33LCJZ"
};


const auth = getAuth(app);
const useStyles = makeStyles((theme) => ({
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(2, 0),
  },
  searchInput: {
    marginRight: theme.spacing(2),
    width: '50%',
  },
  buttonContainer: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const AdminAccountSearch = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

//   //get the firebase's user ID
//   const getFirebaseUserID = ({email})=> {
//     var userID = '';
//     auth.getUserByEmail(email)
//     .then(userRecord=> {
//         console.log("Successfully fetched user data from the email: "+ email);
//         userID = userRecord.uid;
//     })
//     .catch(err=> {
//         alert("Having issue with getting user's firebase uid");
//     })
//     return userID;
// }


  const handleSearch = async (event) => {
    event.preventDefault();
    const searchQuery = event.target.elements.input.value.trim();
    setQuery(searchQuery);

    try {
      if (!isNaN(searchQuery) && searchQuery !== '') {
        const { data } = await axios.get(`http://localhost:8080/users/${searchQuery}`);
        setUsers([data]);
      } else {
        const { data } = await axios.get(`http://localhost:8080/users?search=${searchQuery}`);
        setUsers(data);
      }
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      setUsers([]);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle the boolean value
    try {
      await axios.put(`http://localhost:8080/users/${userId}`, { enabled: newStatus });
      setUsers(prevUsers => prevUsers.map(user => user.uid === userId ? { ...user, enabled: newStatus } : user));
    } catch (error) {
      alert('There was an error updating the user status!', error);
    }
  };

  const handleRegisterNewUser = () => {
    window.location.href = '/register';
  };

  const handleManageUser = (userId) => {
    if (userId) {
      window.location.href = `/manage-user/${userId}`;
    } else {
      console.error('Invalid user ID');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.uid !== userId));
    } catch (error) {
      console.error('There was an error deleting the user!', error);
    }
  };

  return (
    <Container style={{ textAlign: 'center' }}>
       <button style = {{"background-color":"#9D96B8"}}onClick = {()=> {
                window.location.assign('/admin')
            }}>Go back to dashboard</button>
      <CssBaseline />
      <Box className={classes.searchContainer}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            id="header-search"
            placeholder="Search Users By Name or User ID"
            name="input"
            variant="outlined"
            size="small"
            className={classes.searchInput}
            fullWidth
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
      </Box>
      <Box className={classes.buttonContainer}>
        <Button variant="success" onClick={handleRegisterNewUser}>
          Register New User
        </Button>
      </Box>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Manage</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid}>
              <td>{user.uid}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.enabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                <Button
                  variant={user.enabled ? 'danger' : 'success'}
                  onClick={() => {
                    toggleStatus(user.uid, user.enabled)
                  }
                  }
                >
                  {user.enabled ? 'Disable' : 'Enable'}
                </Button>
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleManageUser(user.uid)}
                >
                  Manage
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user.uid)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminAccountSearch;



