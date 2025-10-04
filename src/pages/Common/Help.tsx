import React, { useState } from 'react';
import { Search, MessageCircle, Mail, Phone, FileText, HelpCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import toast, { Toaster } from 'react-hot-toast';

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: 'How do I submit an expense?',
      answer: 'Navigate to "Submit Expense" from the menu, fill in the expense details, optionally upload a receipt (OCR will auto-fill details), and click Submit. Your expense will be sent to your manager for approval if configured.',
    },
    {
      question: 'How does the OCR feature work?',
      answer: 'When you upload a receipt image, our OCR technology automatically extracts information like amount, date, merchant name, and categorizes the expense. You can review and edit the extracted data before submitting.',
    },
    {
      question: 'What is the approval workflow?',
      answer: 'Expenses follow a sequential approval process. First, they go to your manager (if configured), then to additional approvers based on approval rules. Conditional rules can also apply, such as percentage-based or specific approver requirements.',
    },
    {
      question: 'How are currencies handled?',
      answer: 'You can submit expenses in any currency. The system automatically converts the amount to your company\'s default currency using real-time exchange rates for manager and admin review.',
    },
    {
      question: 'Can I track my expense status?',
      answer: 'Yes! Go to "My Expenses" to see all your submissions with their current status (Pending, In Progress, Approved, or Rejected). Click on any expense to see detailed approval history and comments.',
    },
    {
      question: 'What are approval rules?',
      answer: 'Admins can configure approval rules that define who approves expenses and under what conditions. Rules can include threshold amounts, sequential approvers, percentage-based approval, or specific approver requirements.',
    },
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket submitted successfully! We\'ll get back to you soon.');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Help & Support</h1>
        <p className="text-gray-400 mt-2">Find answers or contact our support team</p>
      </div>

      {/* Search */}
      <Card>
        <Input
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={20} />}
        />
      </Card>

      {/* FAQ */}
      <Card title="Frequently Asked Questions" subtitle="Find quick answers to common questions">
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No results found</p>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border-b border-dark-border last:border-0 pb-4 last:pb-0">
                <h3 className="text-white font-semibold flex items-start gap-2 mb-2">
                  <HelpCircle size={20} className="text-primary-light flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm ml-7">{faq.answer}</p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:bg-dark-hover transition-colors">
          <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail size={32} className="text-primary-light" />
          </div>
          <h3 className="text-white font-semibold mb-2">Email Support</h3>
          <p className="text-gray-400 text-sm mb-4">support@expenseflow.com</p>
          <Button variant="outline" size="sm" className="mx-auto">
            Send Email
          </Button>
        </Card>

        <Card className="text-center hover:bg-dark-hover transition-colors">
          <div className="p-4 bg-secondary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MessageCircle size={32} className="text-secondary-light" />
          </div>
          <h3 className="text-white font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-400 text-sm mb-4">Available 24/7</p>
          <Button variant="outline" size="sm" className="mx-auto">
            Start Chat
          </Button>
        </Card>

        <Card className="text-center hover:bg-dark-hover transition-colors">
          <div className="p-4 bg-accent/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText size={32} className="text-accent-light" />
          </div>
          <h3 className="text-white font-semibold mb-2">Documentation</h3>
          <p className="text-gray-400 text-sm mb-4">Detailed guides</p>
          <Button variant="outline" size="sm" className="mx-auto">
            View Docs
          </Button>
        </Card>
      </div>

      {/* Submit Ticket */}
      <Card title="Submit a Support Ticket" subtitle="Can't find what you're looking for? Send us a message">
        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <Input
            type="text"
            label="Subject"
            placeholder="Brief description of your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              rows={6}
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary">
            Submit Ticket
          </Button>
        </form>
      </Card>
    </div>
  );
};

