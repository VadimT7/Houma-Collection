import React, { useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the form data to your backend
    toast.success('Message sent! We\'ll get back to you soon.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'EMAIL',
      details: ['info@houma.com', 'support@houma.com'],
    },
    {
      icon: PhoneIcon,
      title: 'PHONE',
      details: ['+216 71 234 567', '+33 1 23 45 67 89'],
    },
    {
      icon: MapPinIcon,
      title: 'STORES',
      details: ['Tunis, Tunisia', 'Paris, France', 'Casablanca, Morocco'],
    },
    {
      icon: ClockIcon,
      title: 'HOURS',
      details: ['Mon-Fri: 9AM - 8PM', 'Sat-Sun: 10AM - 6PM'],
    },
  ]

  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for unworn items with tags attached.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. International shipping rates and times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email to monitor your delivery.',
    },
  ]

  return (
    <>
      <Head>
        <title>Contact - HOUMA | Get in Touch</title>
        <meta name="description" content="Contact HOUMA for inquiries, support, or collaboration. We're here to help with your luxury streetwear needs." />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10" />
        
        <motion.div
          className="houma-container relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">CONNECT</p>
            <h1 className="text-5xl md:text-7xl font-display tracking-wider text-houma-white mb-6">
              GET IN TOUCH
            </h1>
            <p className="text-lg text-houma-white/70 max-w-2xl mx-auto">
              Have a question? Need assistance? Want to collaborate? We're here to help.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="houma-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-display tracking-wider text-houma-white mb-8">
                SEND US A MESSAGE
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                      NAME *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b border-houma-white/20 text-houma-white 
                               py-2 px-0 focus:outline-none focus:border-houma-gold transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b border-houma-white/20 text-houma-white 
                               py-2 px-0 focus:outline-none focus:border-houma-gold transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                    SUBJECT *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-houma-white/20 text-houma-white 
                             py-2 px-0 focus:outline-none focus:border-houma-gold transition-colors duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="press">Press & Media</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-houma-white/50 tracking-[0.2em] mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-transparent border-b border-houma-white/20 text-houma-white 
                             py-2 px-0 focus:outline-none focus:border-houma-gold transition-colors duration-300 
                             resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="houma-button min-w-[200px]"
                >
                  <span>SEND MESSAGE</span>
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-display tracking-wider text-houma-white mb-8">
                CONTACT INFO
              </h2>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <info.icon className="w-5 h-5 text-houma-gold mt-1" />
                      <div>
                        <h3 className="text-xs text-houma-gold tracking-[0.2em] mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail) => (
                          <p key={detail} className="text-sm text-houma-white/70 mb-1">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-houma-white/10">
                <h3 className="text-xs text-houma-gold tracking-[0.2em] mb-4">
                  FOLLOW US
                </h3>
                <div className="flex gap-4">
                  {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social.toLowerCase()}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-houma-white/50 hover:text-houma-gold transition-colors duration-300"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-luxury">
        <div className="houma-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">SUPPORT</p>
            <h2 className="text-3xl font-display tracking-wider text-houma-white">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                className="border-b border-houma-white/10 pb-6 mb-6 last:border-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg text-houma-white mb-3">
                  {item.question}
                </h3>
                <p className="text-sm text-houma-white/60 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-houma-white/50 mb-4">
              Can't find what you're looking for?
            </p>
            <a
              href="mailto:support@houma.com"
              className="text-houma-gold hover:text-houma-gold-light transition-colors duration-300"
            >
              support@houma.com
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="houma-container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-houma-gold text-xs tracking-[0.3em] mb-4">VISIT</p>
            <h2 className="text-3xl font-display tracking-wider text-houma-white mb-8">
              OUR FLAGSHIP STORES
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-display text-houma-white mb-2">TUNIS</h3>
              <p className="text-sm text-houma-white/60">
                Avenue Habib Bourguiba<br />
                Tunis 1001, Tunisia<br />
                +216 71 234 567
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-display text-houma-white mb-2">PARIS</h3>
              <p className="text-sm text-houma-white/60">
                Rue Saint-Honoré<br />
                75001 Paris, France<br />
                +33 1 23 45 67 89
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-display text-houma-white mb-2">CASABLANCA</h3>
              <p className="text-sm text-houma-white/60">
                Boulevard Mohammed V<br />
                Casablanca 20000, Morocco<br />
                +212 5 22 34 56 78
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
