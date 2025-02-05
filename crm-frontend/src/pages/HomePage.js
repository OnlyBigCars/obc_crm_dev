import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import Layout from '../components/layout';
import axios from 'axios';
import { Edit, Copy, Search, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const location = useLocation();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Add new state
    const [welcomeData, setWelcomeData] = useState('');
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]); // Add state for users
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMessage, setSearchMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [filterFormData, setFilterFormData] = useState({
        source: '',
        status: '',
        location: '',
        arrivalMode: '',
        language_barrier: false,
        dateRange: {
            startDate: '',
            endDate: ''
        },
    });

    // Add pagination state
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Add ref for the table body
    const tableRef = useRef(null);
    const [seqNum, setSeqNum] = useState(null);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/?page=1`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setLeads(response.data.leads);
            setTotalPages(response.data.total_pages);
            setCurrentPage(1);
            setTotalLeads(response.data.total_leads);
            setHasMore(response.data.current_page < response.data.total_pages);
            setSeqNum(response.data.seq_num);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoreLeads = async () => {
        if (isLoading || !hasMore) return;

        try {
            setIsLoading(true);
            const nextPage = currentPage + 1;
            const response = await axios.get(`http://localhost:8000/?page=${nextPage}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            setLeads(prevLeads => [...prevLeads, ...response.data.leads]);
            setCurrentPage(nextPage);
            setHasMore(nextPage < response.data.total_pages);
        } catch (error) {
            console.error('Error fetching more leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScroll = useCallback((e) => {
        const element = e.target;
        if (
            !isLoading &&
            hasMore &&
            Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1
        ) {
            fetchMoreLeads();
        }
    }, [isLoading, hasMore]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchMessage('');
        try {
            const response = await axios.get(`http://localhost:8000/api/leads/search/?query=${searchQuery}&page=1`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setLeads(response.data.leads);
            setTotalPages(response.data.total_pages);
            setCurrentPage(1);
            setTotalLeads(response.data.total_leads);
            setHasMore(response.data.current_page < response.data.total_pages);

            if (response.data.leads.length === 0) {
                setSearchMessage(`No leads found for "${searchQuery}"`);
            }
            setSearchQuery('');
        } catch (error) {
            console.error('Error searching leads:', error);
            setSearchMessage('Error occurred while searching');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilterFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        setSearchMessage('');
        try {
            const response = await axios.post(
                'http://localhost:8000/api/leads/filter/',
                { ...filterFormData, page: 1 },
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            setLeads(response.data.leads);
            setTotalPages(response.data.total_pages);
            setCurrentPage(1);
            setTotalLeads(response.data.total_leads);
            setHasMore(response.data.current_page < response.data.total_pages);

            if (response.data.leads.length === 0) {
                setSearchMessage('No leads found for the selected filters');
            }
        } catch (error) {
            console.error('Error filtering leads:', error);
            setSearchMessage('Error occurred while filtering');
        }
    };

    const handleReset = (e) => {
        e.target.form.reset();
        setFilterFormData({
            user: '',
            source: '',
            status: '',
            location: '',
            language_barrier: false
        });
    };

    useEffect(() => {
        // Fetch welcome message and users
        axios.get('http://127.0.0.1:8000/', {
            headers: {
                Authorization: `Token ${token}`
            }
        })
            .then(response => {
                setWelcomeData(response.data.message);
                setUsers(response.data.users); // Set users data
            })
            .catch(error => console.error('Error fetching home data:', error));
    }, [token]);

    useEffect(() => {
        fetchLeads();
    }, [token]);

    useEffect(() => {
        if (location.state?.message) {
            setAlertMessage(location.state.message);
            setShowSuccessAlert(true);
            // Clear location state
            window.history.replaceState({}, document.title);
            // Auto-dismiss after 3 seconds
            setTimeout(() => {
                setShowSuccessAlert(false);
                setAlertMessage('');
            }, 3000);
        }
    }, [location]);

    useEffect(() => {
        const tbody = tableRef.current;
        if (tbody) {
            tbody.addEventListener('scroll', handleScroll);
            return () => tbody.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <Layout>
           
            {showSuccessAlert && alertMessage && (
                <Alert
                    variant="success"
                    onClose={() => setShowSuccessAlert(false)}
                    dismissible
                    className="edit-page-alert"
                    style={{ marginTop: '0.2em' }}
                >
                    <p>{alertMessage}</p>
                </Alert>
            )}
            {/* <h1 className="text-2xl font-bold mb-6">{welcomeData || 'Welcome to the Home Page!'}</h1> */}

            {/* New Form Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p>All Lead</p>
                <form onSubmit={handleFilterSubmit} className="space-y-4">
                    <div className="grid grid-cols-5 gap-4">
                        {/* First Row */}
                        <select
                            name="user"
                            value={filterFormData.user}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                        <select
                            name="source"
                            value={filterFormData.source}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Source</option>
                            <option value="inbound">inbound</option>
                            <option value="outbound">outbound</option>
                            <option value="Website">Website</option>
                            <option value="Google Ads">Google Ads</option>
                            <option value="Whatsapp">Whatsapp</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Reference">Reference</option>
                            <option value="B2B">B2B</option>
                            <option value="SMS">SMS</option>

                        </select>
                        <select
                            name="dateTimeRange"
                            value={filterFormData.dateTimeRange}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Date Time Range</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                        {/* <select
                            name="paymentStatus"
                            value={filterFormData.paymentStatus}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Payment Status</option>
                            <option value="option1">Payment Successful</option>
                            <option value="option2">Payment Pending</option>
                            <option value="option3">Payment Failed</option>
                        </select> */}

                        <select
                            name="arrivalMode"
                            value={filterFormData.arrivalMode}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Arrival Mode</option>
                            <option value="Walkin">Walkin</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Doorstep">Doorstep</option>
                        </select>

                        {/* Language Barrier Checkbox */}
                        <div className="flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="language_barrier"
                                    checked={filterFormData.language_barrier}
                                    onChange={handleFilterChange}
                                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="text-gray-700">Language Barrier</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {/* Second Row */}
                        <select
                            name="status"
                            value={filterFormData.status}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Status</option>
                            <option value="">Lead Status</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Follow Up">Follow Up</option>
                            <option value="Dead">Dead</option>
                            <option value="Communicate To Ops">Communicate To Ops</option>
                            <option value="Referred To Ops">Referred To Ops</option>
                            <option value="Converted">Converted</option>
                            <option value="At Workshop">At Workshop</option>
                            <option value="Completed">Completed</option>
                            <option value="Walkin">Walkin</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Doorstep">Doorstep</option>
                        </select>
                        <select
                            name="location"
                            value={filterFormData.location}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Location</option>
                            <option value="Gurugram">Gurugram</option> <option value="Delhi">Delhi</option> <option value="Faridabad">Faridabad</option> <option value="Kanpur">Kanpur</option> <option value="Dehradun">Dehradun</option> <option value="Chandigarh">Chandigarh</option> <option value="Bangalore">Bangalore</option> <option value="Jaipur">Jaipur</option> <option value="Lucknow">Lucknow</option> <option value="Chennai">Chennai</option> <option value="Kolkata">Kolkata</option> <option value="Mumbai">Mumbai</option> <option value="Hyderabad">Hyderabad</option> <option value="Pune">Pune</option> <option value="Ahmedabad">Ahmedabad</option>
                        </select>
                        <select
                            name="luxuryNormal"
                            value={filterFormData.luxuryNormal}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">Luxury/Normal</option>
                            <option value="luxury">Luxury</option>
                            <option value="normal">Normal</option>
                        </select>
                        <input
                            type="date"
                            name="dateCreated"
                            value={filterFormData.dateCreated}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent date-created-input"
                        />
                        {/* Buttons in the last column */}
                        <div className="flex gap-2">
                            <button
                                type="reset"
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <p>{seqNum || 'No sequence number available'}</p>

            {/* Modified Search Section */}
            <div className="flex justify-between items-center mb-4 mt-8 px-4">
                <div className="w-24"></div> {/* Spacer for centering */}
                <div className="flex items-center justify-center flex-1">
                    <div className="relative w-96"> {/* Fixed width for search field */}
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="LeadId/Mobile/OrderId/Reg/Name"
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        Apply
                    </button>
                </div>
                <button onClick={() => navigate('/edit', { state: { seqNum: seqNum } })}  className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300">
                    Add Lead
                </button>
            </div>

            <div className='flex justify-center'>
                <div className="mt-4" style={{ width: '96%', marginBottom: '0.5em' }}>

                    <div className="">
                        <table className="w-full border-collapse table-container">
                            <thead className="bg-red-500 text-white">
                                <tr>
                                    <th className="p-3 text-left">Lead Id | Type | Location</th>
                                    <th className="p-3 text-left">Name | Vehicle</th>
                                    <th className="p-3 text-left">Number | Source</th>
                                    <th className="p-3 text-left">Order ID | Reg. Number</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">CCE | CA</th>
                                    <th className="p-3 text-left">Date/Time</th>
                                    <th className="p-3 text-left">Created | Modified At</th>
                                    <th className="p-3 text-left">Edit/Copy</th>
                                </tr>
                            </thead>
                            <tbody ref={tableRef}>
                                {leads.map((lead, index) => (
                                    <tr key={`${lead.id}-${index}`} className={`border-b hover:bg-gray-50 ${(lead.status === "Assigned" || !lead.is_read) ? "bg-gray-100 border-l-2 border-l-red-500" : ""
                                        }`}>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">
                                            {lead.id}<br />
                                            {lead.type}<br />
                                            {lead.city}
                                        </td>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">
                                            {lead.name}<br />
                                            {lead.vehicle}
                                        </td>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">
                                            {lead.number}<br />
                                            {lead.source}
                                        </td>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">
                                            {lead.orderId}<br />
                                            {lead.regNumber}
                                        </td>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">{lead.status}</td>
                                        <td className="p-3 whitespace-normal break-words max-w-[150px]">
                                            {lead.cceName}<br />
                                            {lead.caName}
                                        </td>
                                        <td className="p-3">
                                        {lead.arrival_time ? new Date(lead.arrival_time).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}) : 'Not Set'}
                                        </td>
                                        <td className="p-3">
                                        {lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}) : 'NA'}
<br />
{lead.modified_at ? new Date(lead.modified_at).toLocaleString('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}) : 'NA'}
                                        </td>
                                        {/* <td className="p-3">
                <div className="flex gap-2">
                    <Edit size={16} className="cursor-pointer" />
                    
                </div>
            </td> */}
                                        {/* <td className="p-3">
                                            <div className="flex gap-2">
                                                <Edit
                                                    size={16}
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/edit/${lead.id}`)}
                                                />
                                                <Copy size={16} className="cursor-pointer" />
                                            </div>
                                        </td> */}
                                        <td className="p-3">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <Edit
                                                        size={16}
                                                        className="cursor-pointer"
                                                        onClick={() => navigate(`/edit/${lead.id}`)}
                                                    />
                                                    <Plus
                                                        size={16}
                                                        className="cursor-pointer"
                                                        onClick={() => navigate('/edit', {
                                                            state: {
                                                                customerInfo: {
                                                                    customerName: lead.name,
                                                                    mobileNumber: lead.number,
                                                                    source: lead.source
                                                                    // Add any other customer fields you want to pass
                                                                }
                                                            }
                                                        })}
                                                    />
                                                    <Copy size={16} className="cursor-pointer" />
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Add message display above table */}
                        {searchMessage && (
                            <div className="text-center py-2 text-gray-600">
                                {searchMessage}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center mb-2">
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages} ({totalLeads} total leads)
                        </span>
                    </div>
                </div>
            </div>
            {/* <footer className="bg-gray-50">
                <p className="text-center py-4" style={{ marginTop: '2em', marginBottom: '0' }}>
                    © 2025 OnlyBigCars All Rights Reserved.
                </p>
            </footer> */}
        </Layout>
    );
};

export default HomePage;













