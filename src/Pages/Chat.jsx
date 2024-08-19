
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChatPage.css';

const ChatPage = () => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newChat, setNewChat] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/login');
    } else {
      fetchContacts(loggedInUser.username);
    }
  }, [navigate]);

  const fetchContacts = async (username) => {
    try {
      const receivedResponse = await axios.get('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/getContacts', {
        params: { receiver: username }
      });
  
      const sentResponse = await axios.get('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/getSentMessages', {
        params: { sender: username }
      });
  
      const receivedContacts = receivedResponse.data.map(message => message.sender);
      const sentContacts = sentResponse.data.map(message => message.receiver);
  
      // Combine received and sent contacts, remove duplicates, and filter out own username
      const allContacts = Array.from(new Set([...receivedContacts, ...sentContacts]))
                            .filter(contact => contact !== username)
                            .map(sender => ({ sender }));
  
      setContacts(allContacts);
    } catch (error) {
      console.error('Fetch contacts error:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  

  const fetchMessages = async (contact) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const username = loggedInUser.username;

      const receivedResponse = await axios.get('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/getMessages', {
        params: { receiver: username, sender: contact.sender }
      });

      const sentResponse = await axios.get('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/getSentMessages', {
        params: { sender: username, receiver: contact.sender }
      });

      const receivedMessages = receivedResponse.data.map(message => ({
        ...message,
        sender: message.sender === username ? 'You' : message.sender
      }));

      const sentMessages = sentResponse.data.map(message => ({
        ...message,
        sender: 'You'
      }));

      const allMessages = [...receivedMessages, ...sentMessages].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(allMessages.filter(message => message.receiver === contact.sender || message.sender === contact.sender));
    } catch (error) {
      console.error('Fetch messages error:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const sendMessage = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const sender = loggedInUser.username;
      const receiver = activeChat.sender;
      const content = messageText.trim();

      if (!sender || !receiver || !content) {
        toast.error('Please enter all fields.');
        return;
      }

      await axios.post('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/sendMessages', {
        sender,
        receiver,
        content
      });

      toast.success('Message sent successfully.');
      setMessageText('');
      fetchMessages(activeChat); // Refresh messages after sending
    } catch (error) {
      console.error('Send message error:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleContactClick = (contact) => {
    setActiveChat(contact);
    setNewChat(false);
    fetchMessages(contact);
  };

  const handleNewChatSubmit = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      const sender = loggedInUser.username;
      const receiver = newChatUsername.trim();
      const content = newChatMessage.trim();

      if (!sender || !receiver || !content) {
        toast.error('Please enter all fields.');
        return;
      }

      await axios.post('https://boft9m4lnc.execute-api.eu-north-1.amazonaws.com/dev/sendMessages', {
        sender,
        receiver,
        content
      });

      toast.success('Message sent successfully.');
      setNewChat(false);
      setNewChatUsername('');
      setNewChatMessage('');

      // Add the new contact to the contacts list and set as active chat
      const newContact = { sender: receiver };
      setContacts([...contacts, newContact]);
      setActiveChat(newContact);
      fetchMessages(newContact);
    } catch (error) {
      console.error('Send message error:', error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Contacts</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setNewChat(true)}>New Chat</button>
              </div>
              <ul className="list-group list-group-flush">
                {contacts.map(contact => (
                  <li key={contact.sender} className="list-group-item" onClick={() => handleContactClick(contact)}>
                    {contact.sender}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-9">
            {newChat ? (
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Start a New Chat</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username"
                      value={newChatUsername}
                      onChange={(e) => setNewChatUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your message"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleNewChatSubmit}>Send</button>
                  <button className="btn btn-secondary ml-2" onClick={() => setNewChat(false)}>Cancel</button>
                </div>
              </div>
            ) : activeChat ? (
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Chat with {activeChat.sender}</h5>
                </div>
                <div className="card-body">
                  <div className="message-list">
                    {messages.map((message, index) => (
                      <div key={index} className={`message ${message.sender === 'You' ? 'text-right' : 'text-left'}`}>
                        <p><strong>{message.sender}:</strong> {message.content}</p>
                        <small>{new Date(message.timestamp).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                  <div className="message-input mt-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button className="btn btn-primary mt-2" onClick={sendMessage}>Send</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                Select a contact or start a new chat to begin chatting.
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatPage;
