document.addEventListener('DOMContentLoaded',()=>{

    const dadosExtrato ={
        saldo: 4820.90,
        transacoes: [
            {tipo:'venda', descricao:"Venda - Fone" ,valor: 249.90},
            {tipo:'venda', descricao:"Venda - Teclado" ,valor: 499.0},
            {tipo:'pix', descricao:"Venda - Fornecedor" ,valor: -5200.00},
            {tipo:'cashback', descricao:"Venda - Cashback" ,valor: 120.00},
            {tipo:'compra', descricao:"Venda - SSD" ,valor: -8500.00},
            {tipo:'taxa', descricao:"Venda - Taxa de intermediação" ,valor: -150.00},
            {tipo:'venda', descricao:"Venda - Mouse" ,valor: 249.90},
            {tipo:'pix', descricao:"Venda - Cliente Rodrigo Beltran" ,valor: 180.00},
            {tipo:'reembolso', descricao:"Venda - Reembolso - Pedido #A3490" ,valor: -249.90},
            {tipo:'serviço', descricao:"Venda - Assinatura Netflix" ,valor: -49.90}
        ]
    };

    const saldoElemento = document.getElementById('saldo-conta');
    const listaTransacoesElemento = document.getElementById('lista-transacoes');

    saldoElemento.textContent = `Saldo ${dadosExtrato.saldo.toLocaleString('pt-BR',{
        style: 'currency',
        currency: 'BRL'
    })}`

    dadosExtrato.transacoes.forEach(transacao =>{
        const itemLista = document.createElement('li');
        itemLista.classList.add('transacao');

        if(Math.abs(transacao) >= 5000){
            itemLista.classList.add('destaque');
        }

        const ValorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(transacao.valor);

        itemLista.innerHTML = `
            <div class="transacao-info">
            <span> ${transacao.descricao}</span>
            <small>${transacao.valor}</small>
            <span class= "transacao-valor ${transacao.valor > 0 ? 'negativo' : '' }">
            ${ValorFormatado}
        `;
        listaTransacoesElemento.appendChild(itemLista);
    })

});