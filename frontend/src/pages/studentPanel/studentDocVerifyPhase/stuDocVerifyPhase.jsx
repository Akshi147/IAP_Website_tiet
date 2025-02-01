import styles from './stuDocVerifyPhase.module.css';

const StudentDocVerifyPhase = () => {
  return (
    <div className={`${styles.container} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className={`${styles.card} bg-white shadow-xl rounded-lg overflow-hidden`}>
          <div className="px-4 py-5 sm:p-6">
            <h2 className={`${styles.title} text-center text-3xl font-extrabold text-gray-900 mb-8`}>
              Documents Under Approval
            </h2>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Your documents are currently under review. We will notify you via email about the status of your
                verification.
              </p>
              <p className="text-lg text-gray-700">Please check your email regularly for updates.</p>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900">Need Assistance?</h3>
              <p className="mt-2 text-sm text-gray-600">
                If you have any questions or need help, please contact your mentor:
              </p>
              <div className={`${styles.assistanceCard} mt-3 bg-gray-50 p-4 rounded-md`}>
                <p className="text-sm font-medium text-gray-500">Mentor Contact Details:</p>
                <p className="mt-1 text-sm text-gray-900">Name: Dr. Jane Smith</p>
                <p className="text-sm text-gray-900">Email: jane.smith@university.edu</p>
                <p className="text-sm text-gray-900">Phone: (123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDocVerifyPhase;