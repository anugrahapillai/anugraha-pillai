import fs from 'fs';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true' || process.env.VERCEL_ENV !== undefined || process.env.NOW_BUILDER !== undefined;

if (isVercel) {
  console.log('--- Vercel Build Environment Detected ---');
  if (fs.existsSync('proxy.js')) {
    let content = fs.readFileSync('proxy.js', 'utf8');
    // Replace "export async function proxy" with "export async function middleware"
    content = content.replace(/export async function proxy\(/g, 'export async function middleware(');
    fs.writeFileSync('middleware.js', content, 'utf8');
    fs.unlinkSync('proxy.js');
    console.log('Successfully prepared middleware.js for Vercel deployment.');
  } else {
    console.log('proxy.js not found. Skipping transformation.');
  }
} else {
  console.log('--- Local Build/Dev Environment Detected ---');
  if (fs.existsSync('middleware.js')) {
    let content = fs.readFileSync('middleware.js', 'utf8');
    // Replace "export async function middleware" with "export async function proxy"
    content = content.replace(/export async function middleware\(/g, 'export async function proxy(');
    fs.writeFileSync('proxy.js', content, 'utf8');
    fs.unlinkSync('middleware.js');
    console.log('Successfully prepared proxy.js for local development.');
  } else {
    console.log('middleware.js not found. proxy.js is already active.');
  }
}
