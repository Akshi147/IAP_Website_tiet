import React from 'react';

const PendingApproval = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                            Account Created Successfully!
                        </h2>
                        <div className="text-center space-y-4">
                            <p className="text-lg text-gray-700">
                                Your faculty account has been successfully created.
                            </p>
                            <p className="text-lg text-gray-700">
                                It is currently under admin approval. You will be notified once it is approved.
                            </p>
                            <p className="text-sm text-gray-500">
                                Please wait while the admin reviews your application. This process may take some time.
                            </p>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <h3 className="text-lg font-medium text-gray-900">Need Assistance?</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                If you have any concerns or need help, please contact the admin:
                            </p>
                            <div className="mt-3 bg-gray-50 p-4 rounded-md">
                                <p className="text-sm font-medium text-gray-500">Admin Contact Details:</p>
                                <p className="mt-1 text-sm text-gray-900">Name: Prof. Rajesh Kumar</p>
                                <p className="text-sm text-gray-900">Email: admin@university.edu</p>
                                <p className="text-sm text-gray-900">Phone: (987) 654-3210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
