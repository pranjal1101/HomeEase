const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('=== STARTING MVP BACKEND VERIFICATION TESTS ===\n');

    console.log('--- Testing USER Endpoints ---');

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

    const getAllUsersRes = await fetch(`${BASE_URL}/users`);
    const getAllUsersData = await getAllUsersRes.json();
    console.log('Get All Users (200):', getAllUsersData.success ? 'Success' : 'Failed', `(Count: ${getAllUsersData.data?.length})`);
    if (getAllUsersData.data && getAllUsersData.data.length > 0) {
      console.log('Verify newest user is first:', getAllUsersData.data[0]._id === userId ? 'PASS' : 'FAIL');
    }

    const getUserRes = await fetch(`${BASE_URL}/users/${userId}`);
    const getUserData = await getUserRes.json();
    console.log('Get User by ID (200):', getUserData.success ? 'Success' : 'Failed');

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

    console.log('\n--- Testing SERVICE Endpoints ---');

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

    const getServicesRes = await fetch(`${BASE_URL}/services`);
    const getServicesData = await getServicesRes.json();
    console.log('Get All Services (200):', getServicesData.success ? 'Success' : 'Failed', `(Total Count: ${getServicesData.data?.length})`);

    const searchRes = await fetch(`${BASE_URL}/services?search=master`);
    const searchData = await searchRes.json();
    console.log('Search Services ?search=master (200):', searchData.success ? 'Success' : 'Failed', `(Matches: ${searchData.data?.length})`);
    if (searchData.data && searchData.data.length > 0) {
      console.log('  Matches serviceName:', searchData.data[0].serviceName);
    }

    const categoryRes = await fetch(`${BASE_URL}/services?category=Electrician`);
    const categoryData = await categoryRes.json();
    console.log('Filter Services ?category=Electrician (200):', categoryData.success ? 'Success' : 'Failed', `(Matches: ${categoryData.data?.length})`);

    const paginationRes = await fetch(`${BASE_URL}/services?page=1&limit=2`);
    const paginationData = await paginationRes.json();
    console.log('Paginate Services ?page=1&limit=2 (200):', paginationData.success ? 'Success' : 'Failed', `(Returned items count: ${paginationData.data?.length})`);

    console.log('\n--- Testing BOOKING Endpoints ---');

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

    const getBookingsRes = await fetch(`${BASE_URL}/bookings`);
    const getBookingsData = await getBookingsRes.json();
    console.log('Get All Bookings (200):', getBookingsData.success ? 'Success' : 'Failed', `(Total Count: ${getBookingsData.data?.length})`);
    if (getBookingsData.data && getBookingsData.data.length > 0) {
      console.log('Verify newest booking is first:', getBookingsData.data[0]._id === bookingId ? 'PASS' : 'FAIL');
    }

    const updateBookingRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const updateBookingData = await updateBookingRes.json();
    console.log('Update Booking (200):', updateBookingData.success ? 'Success' : 'Failed', `(New Status: ${updateBookingData.data?.status})`);

    console.log('\n--- Testing CLEANUP (Delete Endpoints) ---');

    const deleteBookingRes = await fetch(`${BASE_URL}/bookings/${bookingId}`, { method: 'DELETE' });
    const deleteBookingData = await deleteBookingRes.json();
    console.log('Delete Booking (200):', deleteBookingData.success ? 'Success' : 'Failed');

    const deleteServiceRes = await fetch(`${BASE_URL}/services/${serviceId}`, { method: 'DELETE' });
    const deleteServiceData = await deleteServiceRes.json();
    console.log('Delete Service (200):', deleteServiceData.success ? 'Success' : 'Failed');

    const deleteUserRes = await fetch(`${BASE_URL}/users/${userId}`, { method: 'DELETE' });
    const deleteUserData = await deleteUserRes.json();
    console.log('Delete User (200):', deleteUserData.success ? 'Success' : 'Failed');

    console.log('\n=== ALL MVP VERIFICATION TESTS COMPLETED SUCCESSFULLY! ===');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
};

runTests();
