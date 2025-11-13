
export enum Status {
  Pendente = 'Pendente',
  EmProgresso = 'Em Progresso',
  Concluido = 'Concluído',
  Cancelado = 'Cancelado',
}

export interface Machine {
  id: number;
  code: string;
  name: string;
  area: string;
}

export interface WorkOrder {
  id: number;
  number: string;
  product: string;
  quantity: number;
  status: Status;
  machine_id: number;
}
