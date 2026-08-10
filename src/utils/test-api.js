/**
 * HomeEase API MVP Refactoring Verification Script
 * This script tests the full RESTful lifecycle and advanced search/pagination features.
 * Make sure the server is running on http://localhost:5000 before executing this script.
 */

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('=== STARTING MVP BACKEND VERIFICATION TESTS ===\n');

    // ----------------------------------------------------
    // 1. USER CRUD & LIST TESTS
    // ----------------------------------------------------
    console.log('--- Testing USER Endpoints ---');

    // Create User
    const createUserRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MVP Tester',
        email: 'mvp.tester@example.com',
        password: 'securePassword123',
        phone: '1234567890',
        address: '100 Startup Hub, Silicon Valley'
      })
    });
    const createUserData = await createUserRes.json();
    console.log('Create User (201):', createUserData.success ? 'Success' : 'Failed', `(ID: ${createUserData.data?._id})`);

    if (!createUserData.success) {
      throw new Error(`Failed to create user: ${createUserData.message}`);
    }
    const userId = createUserData.data._id;

    // Get All Users (New Endpoint + Sorting check)
    const getAllUsersRes = await fetch(`${BASE_URL}/users`);
    const getAllUsersData = await getAllUsersRes.json();
    console.log('Get All Users (200):', getAllUsersData.success ? 'Success' : 'Failed', `(Count: ${getAllUsersData.data?.length})`);
    if (getAllUsersData.data && getAllUsersData.data.length > 0) {
      console.log('Verify newest user is first:', getAllUsersData.data[0]._id === userId ? 'PASS' : 'FAIL');
    }

    // Get Single User
    const getUserRes = await fetch(`${BASE_URL}/users/${userId}`);
    const getUserData = await getUserRes.json();
    console.log('Get User by ID (200):', getUserData.success ? 'Success' : 'Failed');

    // Update User
    const updateUserRes = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated MVP Tester',
        phone: '9998887776'
      })
    });
    const updateUserData = await updateUserRes.json();
    console.log('Update User (200):', updateUserData.success ? 'Success' : 'Failed', `(New Name: ${updateUserData.data?.name})`);


    // ----------------------------------------------------
    // 2. SERVICE SEARCH, FILTER, PAGINATION, AND CRUD
    // ----------------------------------------------------
    console.log('\n--- Testing SERVICE Endpoints ---');

    // Create Service with realistic name
    const createServiceRes = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceName: 'Spark Master Electrical',
        category: 'Electrician',
        description: 'Premium wiring and electric fixing.',
        price: 950
      })
    });
    const createServiceData = await createServiceRes.json();
    console.log('Create Service (201):', createServiceData.success ? 'Success' : 'Failed', `(ID: ${createServiceData.data?._id})`);

    if (!createServiceData.success) {
      throw new Error(`Failed to create service: ${createServiceData.message}`);
    }
    const serviceId = createServiceData.data._id;

    // Get All Services (Standard)
    const getServicesRes = await fetch(`${BASE_URL}/services`);
    const getServicesData = await getServicesRes.json();
    console.log('Get All Services (200):', getServicesData.success ? 'Success' : 'Failed', `(Total Count: ${getServicesData.data?.length})`);

    // Test Search query: ?search=master
    const searchRes = await fetch(`${BASE_URL}/services?search=master`);
    const searchData = await searchRes.json();
    console.log('Search Services ?search=master (200):', searchData.success ? 'Success' : 'Failed', `(Matches: ${searchData.data?.length})`);
    if (searchData.data && searchData.data.length > 0) {
      console.log('  Matches serviceName:', searchData.data[0].serviceName);
    }

    // Test Category filter query: ?category=Electrician
    const categoryRes = await fetch(`${BASE_URL}/services?category=Electrician`);
    const categoryData = await categoryRes.json();
    console.log('Filter Services ?category=Electrician (200):', categoryData.success ? 'Success' : 'Failed', `(Matches: ${categoryData.data?.length})`);

    // Test Pagination query: ?page=1&limit=2
    const paginationRes = await fetch(`${BASE_URL}/services?page=1&limit=2`);
    const paginationData = await paginationRes.json();
    console.log('Paginate Services ?page=1&limit=2 (200):', paginationData.success ? 'Success' : 'Failed', `(Returned items count: ${paginationData.data?.length})`);


    // ----------------------------------------------------
    // 3. BOOKING CRUD & SORTING TESTS
    // ----------------------------------------------------
    console.log('\n--- Testing BOOKING Endpoints ---');

    // Create Booking
    const createBookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        serviceId,
        bookingDate: '2026-09-01',
        bookingTime: '11:00 AM',
        address: '100 Startup Hub, Silicon Valley'
      })
    });
    const createBookingData = await createBookingRes.json();
    console.log('Create Booking (201):', createBookingData.success ? 'Success' : 'Failed', `(ID: ${createBookingData.data?._id})`);

    if (!createBookingData.success) {
      throw new Error(`Failed to create booking: ${createBookingData.message}`);
    }
    const bookingId = createBookingData.data._id;

    // Get All Bookings (Sorting newest first check)
    const getBookingsRes = await fetch(`${BASE_URL}/bookings`);
    const getBookingsData = await getBookingsRes.json();
    console.log('Get All Bookings (200):', getBookingsData.success ? 'Success' : 'Failed', `(Total Count: ${getBookingsData.data?.length})`);
    if (getBookingsData.data && getBookingsData.data.length > 0) {
      console.log('Verify newest booking is first:', getBookingsData.data[0]._id === bookingId ? 'PASS' : 'FAIL');
    }

    // Update Booking Status to Confirmed
    const updateBookingRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const updateBookingData = await updateBookingRes.json();
    console.log('Update Booking (200):', updateBookingData.success ? 'Success' : 'Failed', `(New Status: ${updateBookingData.data?.status})`);


    // ----------------------------------------------------
    // 4. CLEANUP (DELETE CHECKS)
    // ----------------------------------------------------
    console.log('\n--- Testing CLEANUP (Delete Endpoints) ---');

    // Delete Booking
    const deleteBookingRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, { method: 'DELETE' });
    const deleteBookingData = await deleteBookingRes.json();
    console.log('Delete Booking (200):', deleteBookingData.success ? 'Success' : 'Failed');

    // Delete Service
    const deleteServiceRes = await fetch(`${BASE_URL}/services/${serviceId}`, { method: 'DELETE' });
    const deleteServiceData = await deleteServiceRes.json();
    console.log('Delete Service (200):', deleteServiceData.success ? 'Success' : 'Failed');

    // Delete User
    const deleteUserRes = await fetch(`${BASE_URL}/users/${userId}`, { method: 'DELETE' });
    const deleteUserData = await deleteUserRes.json();
    console.log('Delete User (200):', deleteUserData.success ? 'Success' : 'Failed');

    console.log('\n=== ALL MVP VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
};

runTests();
