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
  
  ngOnInit() {
    this.mainFormGroup = new FormGroup({
      tipo: new FormControl<'prazo' | 'data'>('prazo'),
      quantidadeDiasPrazo: new FormControl(365),
      unidade: new FormControl<'dias' | 'meses'>('dias'),
      dataVencimento: new FormControl('2026-01-01')
    });

    this.mainFormGroup.get('quantidadeDiasPrazo')!.valueChanges
      .subscribe(() => {        
        if (this.tipoSelecionado == 'prazo') {
          this.calcularDataPorPrazo();
        }
      });

    this.mainFormGroup.get('dataVencimento')!.valueChanges
      .subscribe(() => {
        if (this.tipoSelecionado == 'data') {
          this.calculaPrazoPorData();
        }
      });

    this.mainFormGroup.get('unidade')!.valueChanges
      .subscribe(unidade => {
        if (this.tipoSelecionado !== 'prazo') return;

        const valorExibido = this.prazoExibido;
        const dias = unidade == 'meses' ? this.mesesParaDias(valorExibido) : valorExibido;

        this.mainFormGroup.get('quantidadeDiasPrazo')!.setValue(dias);
        this.calcularDataPorPrazo();
      });
  }
  
  selecionarTipo(tipo: 'prazo' | 'data') {
    this.tipoSelecionado = tipo;
  }

  atualizaPrazo(event: Event) {
    const valorForm = Number((event.target as HTMLInputElement).value);
    const unidade = this.mainFormGroup.get('unidade')!.value;

    const dias = unidade == 'meses' ? this.mesesParaDias(valorForm) : valorForm;

    this.mainFormGroup.get('quantidadeDiasPrazo')!.setValue(dias);
  }

  calcularDataPorPrazo() {
    const quantidadeDias = this.mainFormGroup.get('quantidadeDiasPrazo')!.value;
    const dataAtual = dayjs().startOf('day');
    const dataFutura = dataAtual.add(quantidadeDias, 'day');

    this.mainFormGroup.get('dataVencimento')!.setValue(dataFutura.format('YYYY-MM-DD'), { emitEvent: false })
  }

  calculaPrazoPorData() {
    const dataForm = dayjs(this.mainFormGroup.get('dataVencimento')!.value);
    const dataAtual = dayjs().startOf('day');
    const quantidadeDias = dataForm.diff(dataAtual, 'day');

    this.mainFormGroup.get('quantidadeDiasPrazo')!.setValue(quantidadeDias, { emitEvent: false });
  }

  get prazoExibido(): number {
    const quantidadeDias = this.mainFormGroup.get('quantidadeDiasPrazo')!.value ?? 0;
    const unidade = this.mainFormGroup.get('unidade')!.value;

    return unidade === 'meses' ? this.diasParaMeses(quantidadeDias) :  quantidadeDias;
  }

  private mesesParaDias(meses: number): number {
    if (meses === 12) return 365;
    return meses * 30;
  }

  private diasParaMeses(dias: number): number {
    return Math.max(1, Math.floor(dias / 30));
  }
}
