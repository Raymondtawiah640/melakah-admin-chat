import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ChatDashboard } from './chat-dashboard/chat-dashboard';
import { ChatView } from './chat-view/chat-view';
import { IncomingChats } from './incoming-chats/incoming-chats';
import { ActiveChats } from './active-chats/active-chats';

export const routes: Routes = [
  { path: 'login', component: Login },                 // login route
  { path: 'dashboard', component: ChatDashboard },
  { path: 'chat/:userId', component: ChatView },
  { path: 'incoming-chats', component: IncomingChats },
  { path: 'active-chats', component: ActiveChats },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: 'login' }                  // wildcard route
];
