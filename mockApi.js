const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

//Send Push Notification
app.post('/send-notification', (req, res) => {
    const { title, body, token } = req.body;

    console.log('🔔 Notification Details:');
    console.log(`Title: ${title}`);
    console.log(`Body: ${body}`);
    console.log(`Token: ${token}`);

    res.status(200).json({
        success: true,
        message: 'Mock notification sent successfully',
    });
});

// Get Leave Requests
app.get('/all-leave-requests', (req, res) => {
    const mockLeaveRequests = [
        {
            id: 1,
            status: "Approved",
            leaveType: "Personal",
            fromDate: "Apr 14",
            toDate: "Apr 14",
            duration: "1",
        },
        {
            id: 2,
            status: "Pending",
            leaveType: "Sick",
            fromDate: "Apr 15",
            toDate: "Apr 16",
            duration: "2",
        },
        {
            id: 3,
            status: "Approved",
            leaveType: "Casual",
            fromDate: "Apr 12",
            toDate: "Apr 13",
            duration: "2",
        },
        {
            id: 4,
            status: "Pending",
            leaveType: "Sick",
            fromDate: "Apr 12",
            toDate: "Apr 12",
            duration: "1",
        }
    ];

    res.status(200).json(mockLeaveRequests);
});

//  Clock In 
app.post('/clock-in', (req, res) => {
    const { userId, time } = req.body;

    console.log('🕒 Clock-In:');
    console.log(`User: ${userId}, Time: ${time}`);

    res.status(200).json({
        success: true,
        message: 'Clock-in recorded successfully',
    });
});

//  Clock Out
app.post('/clock-out', (req, res) => {
    const { userId, time } = req.body;

    console.log('🕔 Clock-Out:');
    console.log(`User: ${userId}, Time: ${time}`);

    res.status(200).json({
        success: true,
        message: 'Clock-out recorded successfully',
    });
});

// Leave Request 
app.post('/leave-request', (req, res) => {
    const { userId, fromDate, toDate, reason } = req.body;

    console.log('📅 Leave Request:');
    console.log(`User: ${userId}, From: ${fromDate}, To: ${toDate}, Reason: ${reason}`);

    res.status(200).json({
        success: true,
        message: 'Leave request submitted successfully',
    });
});

//  QR Scan
app.post('/qr-scan', (req, res) => {
    const { userId, qrData, scannedAt } = req.body;

    console.log('📷 QR Scan:');
    console.log(`User: ${userId}, Data: ${qrData}, Time: ${scannedAt}`);

    res.status(200).json({
        success: true,
        message: 'QR scan data received successfully',
    });
});

app.listen(PORT, () => {
    console.log(`✅ Mock API server running at http://localhost:${PORT}`);
});
