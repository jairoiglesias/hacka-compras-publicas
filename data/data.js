
var data_old = [
    {codigo:"201-1", natureza: "Empresa Pública", faturamento: 0},
    {codigo:"203-8", natureza: "Sociedade de Economia Mista"},
    {codigo:"204-6", natureza: "Sociedade Anônima Aberta"},
    {codigo:"205-4", natureza: "Sociedade Anônima Fechada"},
    {codigo:"206-2", natureza: "Sociedade Empresária Limitada"},
    {codigo:"207-0", natureza: "Sociedade Empresária em Nome Coletivo"},
    {codigo:"208-9", natureza: "Sociedade Empresária em Comandita Simples"},
    {codigo:"209-7", natureza: "Sociedade Empresária em Comandita por Ações"},
    {codigo:"212-7", natureza: "Sociedade em Conta de Participação"},
    {codigo:"214-3", natureza: "Cooperativa"},
    {codigo:"215-1", natureza: "Consórcio de Sociedades"},
    {codigo:"216-0", natureza: "Grupo de Sociedades"},
    {codigo:"223-2", natureza: "Sociedade Simples Pura"},
    {codigo:"224-0", natureza: "Sociedade Simples Limitada"},
    {codigo:"225-9", natureza: "Sociedade Simples em Nome Coletivo"},
    {codigo:"226-7", natureza: "Sociedade Simples em Comandita Simples"},
    {codigo:"229-1", natureza: "Consórcio Simples"},
    {codigo:"230-5", natureza: "Empresa Individual de Responsabilidade Limitada (de Natureza Empresária)"},
    {codigo:"231-3", natureza: "Empresa Individual de Responsabilidade Limitada (de Natureza Simples)"},
    {codigo:"306-9", natureza: "Fundação Privada"},
    {codigo:"322-0", natureza: "Organização Religiosa"},
    {codigo:"330-1", natureza: "Organização Social (OS)"},
    {codigo:"399-9", natureza: "Associação Privada"},
    {codigo:"408-1", natureza: "Contribuinte Individual"},
    {codigo:"213-5", natureza: "Empresário (Individual)", faturamento: 80000, funcionarios: 1, tipo: "pequeno porte"}

]


// Microempresa – faturamento anual até R$ 360.000,00.

// Pequeno porte – faturamento anual entre R$360.000,01 até R$3.600.000,00.

// Médio porte – faturamento anual entre R$3.600.000,01 até 12.000.000,00.

// Grande – faturamento anual superior a R$12.000.000,01.


var data = [

    {texto: 'MEI', codigo: '', faturamento: 80000, porte: 'pequeno'},
    {texto: 'LTDA;LIMITADA;ME', codigo: '206-2', faturamento: 360000, porte: 'medio'},
    {texto: 'LTDA;LIMITADA;EPP', codigo: '206-2', faturamento: 3600000, porte: 'medio/grande'},
    {texto: 'SA;S.A.', codigo: '204-6;205-4', faturamento: 0, porte: 'grande'},
    {texto: 'EI', codigo: '213-5', faturamento: 360000, porte: 'medio'},
    {texto: '', codigo: '203-8', faturamento: 0, porte: 'grande'}

]

module.exports = data