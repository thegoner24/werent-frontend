import React from 'react';

const mockCards = [
  {
    id: 1,
    brand: 'Visa',
    last4: '4242',
    exp: '12/27',
    name: 'Jane Doe',
    isDefault: true,
  },
  {
    id: 2,
    brand: 'Mastercard',
    last4: '1234',
    exp: '06/26',
    name: 'Jane Doe',
    isDefault: false,
  },
  {
    id: 3,
    brand: 'American Express',
    last4: '0005',
    exp: '09/25',
    name: 'Jane Doe',
    isDefault: false,
  },
];

const PaymentsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition-all">+ Add Card</button>
      </div>
      {mockCards.length === 0 ? (
        <p className="text-gray-600">You have no saved payment methods.</p>
      ) : (
        <div className="space-y-4">
          {mockCards.map(card => (
            <div
              key={card.id}
              className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border shadow-sm bg-gradient-to-r ${card.isDefault ? 'from-purple-50 to-pink-50 border-purple-400' : 'from-white to-gray-50 border-gray-200'} transition`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 flex items-center justify-center rounded bg-white border border-gray-200 shadow-sm mr-2">
                  {card.brand === 'Visa' && <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" />}
                  {card.brand === 'Mastercard' && <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-5" />}
                  {card.brand === 'American Express' && <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">**** **** **** {card.last4}</span>
                  <span className="text-xs text-gray-500">Exp: {card.exp}</span>
                  <span className="text-xs text-gray-500">{card.name}</span>
                </div>
                {card.isDefault && (
                  <span className="ml-4 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shadow">Default</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                {!card.isDefault && (
                  <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition">Set as Default</button>
                )}
                <button
                  className={`text-xs font-semibold px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${card.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={card.isDefault}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentsTab;

