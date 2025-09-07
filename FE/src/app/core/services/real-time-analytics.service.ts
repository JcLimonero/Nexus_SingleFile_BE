import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RealTimeMetric {
  id: string;
  type: 'document' | 'process' | 'user' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  data: any;
  timestamp: Date;
}

export interface RealTimeStats {
  documents: {
    total: number;
    today: number;
    pending: number;
    completed: number;
  };
  processes: {
    total: number;
    active: number;
    completed: number;
    averageTime: number;
  };
  users: {
    online: number;
    total: number;
    activeToday: number;
  };
  system: {
    uptime: number;
    responseTime: number;
    memoryUsage: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RealTimeAnalyticsService {
  private socket: WebSocket | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private metricsSubject = new Subject<RealTimeMetric>();
  private statsSubject = new BehaviorSubject<RealTimeStats | null>(null);
  
  public connectionStatus$ = this.connectionStatus.asObservable();
  public metrics$ = this.metricsSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    try {
      // En un entorno real, usarías el WebSocket del backend
      // Por ahora simulamos la conexión
      this.simulateConnection();
    } catch (error) {
      console.error('Error initializing WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  private simulateConnection(): void {
    // Simulamos una conexión exitosa
    this.connectionStatus.next(true);
    
    // Simulamos métricas en tiempo real
    this.startSimulation();
  }

  private startSimulation(): void {
    // Simulamos eventos cada 5-10 segundos
    setInterval(() => {
      if (this.connectionStatus.value) {
        this.simulateRandomMetric();
        this.updateStats();
      }
    }, Math.random() * 5000 + 5000);
  }

  private simulateRandomMetric(): void {
    const types: RealTimeMetric['type'][] = ['document', 'process', 'user', 'system'];
    const actions: RealTimeMetric['action'][] = ['created', 'updated', 'deleted', 'status_changed'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    const metric: RealTimeMetric = {
      id: this.generateId(),
      type,
      action,
      data: this.generateMetricData(type, action),
      timestamp: new Date()
    };

    this.metricsSubject.next(metric);
  }

  private generateMetricData(type: RealTimeMetric['type'], action: RealTimeMetric['action']): any {
    switch (type) {
      case 'document':
        return {
          documentId: Math.floor(Math.random() * 1000),
          documentType: 'Contrato',
          agency: 'Agencia Central',
          status: action === 'status_changed' ? 'completed' : 'pending'
        };
      case 'process':
        return {
          processId: Math.floor(Math.random() * 1000),
          processName: 'Proceso de Aprobación',
          agency: 'Agencia Central',
          status: action === 'status_changed' ? 'completed' : 'in_progress'
        };
      case 'user':
        return {
          userId: Math.floor(Math.random() * 100),
          username: 'usuario' + Math.floor(Math.random() * 100),
          action: action,
          timestamp: new Date()
        };
      case 'system':
        return {
          metric: 'performance',
          value: Math.floor(Math.random() * 100),
          threshold: 80
        };
      default:
        return {};
    }
  }

  private updateStats(): void {
    const stats: RealTimeStats = {
      documents: {
        total: Math.floor(Math.random() * 1000) + 500,
        today: Math.floor(Math.random() * 50) + 10,
        pending: Math.floor(Math.random() * 100) + 20,
        completed: Math.floor(Math.random() * 800) + 200
      },
      processes: {
        total: Math.floor(Math.random() * 500) + 200,
        active: Math.floor(Math.random() * 50) + 10,
        completed: Math.floor(Math.random() * 400) + 100,
        averageTime: Math.floor(Math.random() * 120) + 30
      },
      users: {
        online: Math.floor(Math.random() * 20) + 5,
        total: Math.floor(Math.random() * 100) + 50,
        activeToday: Math.floor(Math.random() * 30) + 10
      },
      system: {
        uptime: 99.9,
        responseTime: Math.floor(Math.random() * 50) + 100,
        memoryUsage: Math.floor(Math.random() * 20) + 60
      }
    };

    this.statsSubject.next(stats);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeConnection();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.connectionStatus.next(false);
    }
  }

  // Métodos públicos
  connect(): void {
    if (!this.connectionStatus.value) {
      this.reconnectAttempts = 0;
      this.initializeConnection();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatus.next(false);
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  subscribeToMetric(type: RealTimeMetric['type']): Observable<RealTimeMetric> {
    return this.metrics$.pipe(
      filter(metric => metric.type === type)
    );
  }

  getCurrentStats(): RealTimeStats | null {
    return this.statsSubject.value;
  }

  isConnected(): boolean {
    return this.connectionStatus.value;
  }
}
