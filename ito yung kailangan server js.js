/**
 * MNL-AI Premium Website Server - Fixed Version
 * Express.js backend with proper static file serving
 * Built by Tristan Trinidad
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (before static files to see all requests)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

// CRITICAL: Static file serving MUST come before any catch-all routes
// Serve /public directory for assets
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve root-level static files (style.css, script.js)
app.use(express.static(path.join(__dirname), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

/**
 * API Routes (before catch-all)
 */

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Alternative health check
app.get('/healthz', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Contact form handler
app.post('/contact', (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (name, email, message)'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Log the submission
    console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Company: ${company || 'Not provided'}`);
    console.log(`Service: ${service || 'Not specified'}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('=====================================\n');

    // Success response
    res.json({
      success: true,
      message: 'Thank you! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.'
    });
  }
});

// API endpoint for services
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 'website',
      name: 'AI-Powered Websites',
      startingPrice: 25000,
      currency: 'PHP'
    },
    {
      id: 'chatbot',
      name: 'Smart AI Chatbots',
      startingPrice: 15000,
      currency: 'PHP'
    },
    {
      id: 'marketing',
      name: 'Marketing Assets',
      startingPrice: 8000,
      currency: 'PHP'
    },
    {
      id: 'automation',
      name: 'AI Workflow Automation',
      startingPrice: 12000,
      currency: 'PHP'
    }
  ];
  
  res.json({ success: true, data: services });
});

/**
 * SPA Routes (MUST come after API routes but before catch-all)
 */

// Specific routes for SPA pages
app.get('/work', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving /work:', err);
      res.status(404).json({ success: false, error: 'Page not found' });
    }
  });
});

app.get('/work/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving /work/:slug:', err);
      res.status(404).json({ success: false, error: 'Page not found' });
    }
  });
});

/**
 * CATCH-ALL ROUTE (MUST BE LAST)
 * This handles all remaining requests and serves index.html for SPA routing
 */
app.get('*', (req, res) => {
  // Only serve index.html for GET requests that don't start with /api
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  }

  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MNL-AI Website running on port ${PORT}`);
  console.log(`📧 Contact form submissions logged to console`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Static files served from: ${__dirname}`);
  console.log(`📁 Public assets served from: ${path.join(__dirname, 'public')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;