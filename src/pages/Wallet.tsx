import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Download, Plus, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Wallet: React.FC = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const { wallet, transactions, user, withdraw } = useApp();

  const totalEarnings = transactions
    .filter(t => t.type === 'PRIZE' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">My Wallet</h1>
              <p className="text-orange-100">Manage your earnings and withdrawals</p>
            </div>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-green-300" />
                <span className="text-sm text-orange-100">Available Balance</span>
              </div>
              <p className="text-2xl font-bold">
                {hideBalance ? '••••' : formatCurrency(wallet.balance)}
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-300" />
                <span className="text-sm text-orange-100">Pending</span>
              </div>
              <p className="text-2xl font-bold">
                {hideBalance ? '••••' : formatCurrency(wallet.pending)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={wallet.balance < 5}
            className="flex items-center justify-center gap-2 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="text-orange-500" size={20} />
            <span className="font-semibold text-gray-900">Withdraw</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <Plus className="text-blue-500" size={20} />
            <span className="font-semibold text-gray-900">Add Funds</span>
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="font-bold text-green-600">
                {hideBalance ? '••••' : formatCurrency(user?.stats.totalEarnings || 0)}
              </p>
            </div>
            
            <div className="text-center">
              <DollarSign className="text-blue-500 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Avg. Win</p>
              <p className="font-bold text-blue-600">
                {hideBalance ? '••••' : formatCurrency(
                  user?.stats.challengesWon ? (user.stats.totalEarnings / user.stats.challengesWon) : 0
                )}
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="text-orange-500 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="font-bold text-orange-600">
                {user?.stats.winRate ? `${user.stats.winRate}%` : '0%'}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Your earnings and withdrawals will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'PRIZE' ? 'bg-green-100' :
                      transaction.type === 'ENTRY' ? 'bg-red-100' :
                      transaction.type === 'WITHDRAW' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <DollarSign size={20} className={
                        transaction.type === 'PRIZE' ? 'text-green-600' :
                        transaction.type === 'ENTRY' ? 'text-red-600' :
                        transaction.type === 'WITHDRAW' ? 'text-blue-600' : 'text-gray-600'
                      } />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.type === 'PRIZE' ? 'Prize Won' :
                         transaction.type === 'ENTRY' ? 'Challenge Entry' :
                         transaction.type === 'WITHDRAW' ? 'Withdrawal' : 'Transaction'}
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          balance={wallet.balance}
          onWithdraw={withdraw}
        />
      )}
    </div>
  );
};

interface WithdrawModalProps {
  onClose: () => void;
  balance: number;
  onWithdraw: (amount: number, method: string) => Promise<boolean>;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, balance, onWithdraw }) => {
  const [amount, setAmount] = useState(5);
  const [method, setMethod] = useState('paypal');
  const [processing, setProcessing] = useState(false);

  const handleWithdraw = async () => {
    setProcessing(true);
    
    try {
      const success = await onWithdraw(amount, method);
      if (success) {
        onClose();
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Withdraw Funds</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  min="5"
                  max={balance}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: {formatCurrency(balance)} • Minimum: $5.00
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Debit Card</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Processing Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Processing time: 1-3 business days</li>
              <li>• Processing fee: $0.50 flat fee</li>
              <li>• You'll receive: {formatCurrency(amount - 0.50)}</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={amount < 5 || amount > balance || processing}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              {processing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};