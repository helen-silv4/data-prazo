import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mainFormGroup!: FormGroup;
  tipoSelecionado: 'prazo' | 'data' = 'prazo';
  quantidadeDiasPrazoAtual!: number;
  
  ngOnInit() {
    this.mainFormGroup = new FormGroup({
      tipo: new FormControl<'prazo' | 'data'>('prazo'),
      quantidadeDiasPrazo: new FormControl(365),
      unidade: new FormControl<'dia' | 'mes'>('dia'),
      dataVencimento: new FormControl('2026-01-01')
    });

    this.quantidadeDiasPrazoAtual = Number(this.mainFormGroup.get('quantidadeDiasPrazo')!.value);

    this.mainFormGroup.get('quantidadeDiasPrazo')!.valueChanges
      .subscribe(valor => {
        this.quantidadeDiasPrazoAtual = Number(valor);
        
        if (this.tipoSelecionado == 'prazo') {
          this.calcularDataPorPrazo();
        }
      })

    this.mainFormGroup.get('dataVencimento')!.valueChanges
      .subscribe(() => {

        if (this.tipoSelecionado == 'data') {
          this.calculaPrazoPorData();
        }
      })

    this.calcularDataPorPrazo();  

  }
  
  selecionarTipo(tipo: 'prazo' | 'data') {
    this.tipoSelecionado = tipo;
  }

  calcularDataPorPrazo() {
    const dataAtual = dayjs().startOf('day');
    const dataFutura = dataAtual.add(this.quantidadeDiasPrazoAtual, 'day');

    this.mainFormGroup.get('dataVencimento')!.setValue(dataFutura.format('YYYY-MM-DD'), { emitEvent: false })
  }

  calculaPrazoPorData(){
    const dataForm = dayjs(this.mainFormGroup.get('dataVencimento')!.value);
    const dataAtual = dayjs().startOf('day');
    const quantidade = dataForm.diff(dataAtual, 'day');

    this.mainFormGroup.get('quantidadeDiasPrazo')!.setValue(quantidade, { emitEvent: false });
  }
}
