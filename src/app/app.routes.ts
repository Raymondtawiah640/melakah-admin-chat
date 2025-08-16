import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ChatDashboard } from './chat-dashboard/chat-dashboard';
import { ChatView } from './chat-view/chat-view';
import {IncomingChats} from './incoming-chats/incoming-chats';
import {ActiveChats} from './active-chats/active-chats';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: ChatDashboard },
  { path: 'chat/:userId', component: ChatView },
  { path: 'incoming-chats', component: IncomingChats }, // Added route for incoming chats
  {path: 'active-chats', component: ActiveChats} // Added route for active chats  
];
 