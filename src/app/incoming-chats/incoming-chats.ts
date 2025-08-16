import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// ✅ Register only required elements for doughnut chart
Chart.register(ArcElement, Tooltip, Legend);

interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: string;
  starred: number;
  created_at: string;
}

@Component({
  selector: 'app-incoming-chats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BaseChartDirective], // standalone imports
  templateUrl: './incoming-chats.html',
  styleUrls: ['./incoming-chats.css']
})
export class IncomingChats implements OnInit, OnDestroy {
  chats: Chat[] = [];
  loading = false;

  private apiUrl = 'http://localhost:4300/api/incoming-chats.php';
  private adminId = 1;
  private refreshSub: Subscription | undefined;

  // Doughnut chart data
  public chatChartData: ChartData<'doughnut'> = {
    labels: ['Incoming', 'Active', 'Completed'],
    datasets: [
      { data: [0, 0, 0], backgroundColor: ['#FACC15', '#3B82F6', '#22C55E'] }
    ]
  };

  // Doughnut chart options
  public chatChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadIncomingChats();
    // Refresh chats every 10 seconds
    this.refreshSub = interval(10000).subscribe(() => this.loadIncomingChats());
  }

  ngOnDestroy() {
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  loadIncomingChats() {
    this.loading = true;
    this.http.get<Chat[]>(`${this.apiUrl}?admin_id=${this.adminId}`).subscribe({
      next: data => {
        this.chats = data;
        this.updateChartData();
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load incoming chats', err);
        this.loading = false;
      }
    });
  }

  private updateChartData() {
    const incoming = this.chats.filter(c => c.status === 'incoming').length;
    const active = this.chats.filter(c => c.status === 'active').length;
    const completed = this.chats.filter(c => c.status === 'completed').length;

    this.chatChartData.datasets[0].data = [incoming, active, completed];
  }
}
