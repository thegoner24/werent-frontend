import React from 'react';

const mockRentals = [
  {
    id: 1,
    dress: 'Red Evening Gown',
    status: 'Shipped',
    steps: ['Requested', 'Approved', 'Shipped', 'Returned'],
    currentStep: 2,
    dueDate: '2025-07-28T18:00:00+07:00',
    penaltyFee: null,
  },
  {
    id: 2,
    dress: 'Blue Cocktail Dress',
    status: 'Approved',
    steps: ['Requested', 'Approved', 'Shipped', 'Returned'],
    currentStep: 1,
    dueDate: '2025-07-25T18:00:00+07:00',
    penaltyFee: 15.00,
  },
  {
    id: 3,
    dress: 'Green Summer Dress',
    status: 'Returned',
    steps: ['Requested', 'Approved', 'Shipped', 'Returned'],
    currentStep: 3,
    dueDate: '2025-07-20T18:00:00+07:00',
    penaltyFee: null,
  },
];

function RentalStepsTracker({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <ol className="flex items-center w-full mb-4">
      {steps.map((step, idx) => (
        <li key={step} className={`flex-1 flex items-center ${idx < steps.length - 1 ? 'after:content-[" "] after:flex-1 after:border-t-2 after:border-gray-200 after:mx-2' : ''}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${idx <= currentStep ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>{idx + 1}</div>
          <span className={`ml-2 text-sm font-medium ${idx <= currentStep ? 'text-purple-700' : 'text-gray-400'}`}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

const RentalsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dress Rentals</h2>
      {mockRentals.length === 0 ? (
        <p className="text-gray-600">You have no rentals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dress</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Penalty Fee</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mockRentals.map((rental, idx) => (
                <tr key={rental.id} className={idx % 2 === 0 ? 'bg-white hover:bg-purple-50 transition' : 'bg-gray-50 hover:bg-purple-50 transition'}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{rental.dress}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${rental.status === 'Returned' ? 'bg-green-100 text-green-700' : rental.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : rental.status === 'Approved' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{rental.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.dueDate ? new Date(rental.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.penaltyFee ? (
                      <span className="text-red-600 font-semibold">${rental.penaltyFee.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RentalStepsTracker steps={rental.steps} currentStep={rental.currentStep} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default RentalsTab;

