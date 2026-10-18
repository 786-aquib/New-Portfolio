import { defineConfig, devices } from '@playwright/test';
export default defineConfig({testDir:'./tests',fullyParallel:false,workers:1,timeout:20000,expect:{timeout:5000},reporter:[['list'],['html',{open:'never'}]],use:{baseURL:'http://127.0.0.1:5173',channel:'chrome',trace:'retain-on-failure'},projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}]});
