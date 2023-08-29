export class PopupPendientes{
    nuevos: number;
    leidos: number;
    noleidos:number;
    enProceso:number;
    
   constructor() {
      this.nuevos = 0;
      this.leidos = 0;
      this.noleidos = 0;          
      this.enProceso = 0;
    }
  //   count():number{
  //   return this.nuevos + this.leidos + this.noleidos;
  // }
}