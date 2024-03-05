require('dotenv').config()
const axios = require('axios');


const site = process.env.SITE;
const webhook = process.env.WEBHOOK;
const queueUrl = process.env.URL + '/orders/import/queue';
const startProcessingUrl = process.env.URL + '/dispatch/ordersManagerProcess';
const token = process.env.TOKEN;

const headers = {
    Authorization: `Bearer ${token}` 
}

const generateRandomOrderNumber = () => {
    return Math.random().toString(36).substring(7);
}

const generateUniqueAddressInSaoPaulo = () => {
    const streetNames = [
    'Avenida Paulista',
    'Rua da Consolação',
    'Avenida Brigadeiro Faria Lima',
    'Rua Augusta',
    'Alameda Santos',
    'Avenida Ipiranga',
    'Rua Oscar Freire',
    'Avenida Rebouças',
    'Rua Haddock Lobo',
    'Avenida Brasil',
    'Rua Bela Cintra',
    'Avenida Pacaembu',
    'Rua dos Pinheiros',
    'Avenida Europa',
    'Rua Veneza',
    'Avenida Morumbi',
    'Rua Estados Unidos',
    'Avenida Doutor Arnaldo',
    'Rua Frei Caneca',
    'Avenida São João',
    'Rua Teodoro Sampaio',
    'Avenida Ibirapuera',
    'Rua Pamplona',
    'Avenida Santo Amaro',
    'Rua Vergueiro',
    'Avenida Angélica',
    'Rua Joaquim Floriano',
    'Avenida Cidade Jardim',
    'Rua Tabapuã',
    'Avenida Berrini',
    'Rua Gomes de Carvalho',
    'Avenida das Nações Unidas',
    'Rua João Cachoeira',
    'Avenida Giovanni Gronchi',
    'Rua Amador Bueno',
    'Avenida Lins de Vasconcelos',
    'Rua Turiassu',
    'Avenida Sumaré',
    'Rua Clélia',
    'Avenida Jabaquara',
    'Rua Domingos de Morais',
    'Avenida Cupecê',
    'Rua Sena Madureira',
    'Avenida Aricanduva',
    'Rua Matias Aires',
    'Avenida Sapopemba',
    'Rua Heitor Penteado',
    'Avenida Anhaia Mello',
    'Rua Antônio de Barros',
    'Avenida Salim Farah Maluf',
    'Rua Apinajés',
    'Avenida Celso Garcia',
    'Rua Francisco Matarazzo',
    'Avenida Inajar de Souza',
    'Rua da Mooca',
    'Avenida Interlagos',
    'Rua João Ramalho',
    'Avenida Tiradentes',
    'Rua José Bonifácio',
    'Avenida Radial Leste',
    'Rua Silva Bueno',
    'Avenida Ragueb Chohfi',
    'Rua Itapura',
    'Avenida Yervant Kissajikian',
    'Rua Lins de Vasconcelos',
    'Avenida Mateo Bei',
    'Rua Nossa Senhora do Ó',
    'Avenida São Miguel',
    'Rua Oratório',
    'Avenida Itaquera',
    'Rua Pires do Rio',
    'Avenida Engenheiro Caetano Álvares',
    'Rua Voluntários da Pátria',
    'Avenida Professor Luiz Ignácio Anhaia Mello',
    'Rua Luís Góis',
    'Avenida Doutor Ricardo Jafet',
    'Rua Vergueiro',
    'Avenida Cruzeiro do Sul',
    'Rua Galvão Bueno',
    'Avenida do Estado',
    'Rua Líbero Badaró',
    'Avenida Raimundo Pereira de Magalhães',
    'Rua Pedroso de Morais',
    'Avenida Giovanni Gronchi',
    'Rua João Moura',
    'Avenida Professor Francisco Morato',
    'Rua Amaral Gama',
    'Avenida Guarapiranga',
    'Rua Cotovia',
    'Avenida Washington Luís',
    'Rua Loefgren',
    'Avenida Santo Amaro',
    'Rua Madre Cabrini',
    'Rua Atica'
  ];
    
    // Gerar índices aleatórios para selecionar itens dos arrays
    const streetNameIndex = Math.floor(Math.random() * streetNames.length);
    
    // Gerar um número de edifício aleatório
    const buildingNumber = Math.floor(Math.random() * 1000) + 1; // Números de 1 a 1000
  
    // Montar e retornar o endereço
    return `${streetNames[streetNameIndex]}, ${buildingNumber}, São Paulo, SP, Brasil`;
}
  
const generateOrder = () => {
    return {
        "location": {
            "address": {
                "route": generateUniqueAddressInSaoPaulo()
            }
        },
        "order_number": generateRandomOrderNumber(),
        "site": site
    }
}

generateReuqestBody = (quantityOfOrders = 100) => {
    const orders = [];
    for (let i = 0; i < quantityOfOrders; i++) {
        orders.push(generateOrder());
    }
    const request = {
        orders
    }

    if (webhook) {
        request.webhook = webhook;
    }

    return request;
}


const totalRequests = 100;
const orderManagers = [];
let managersProcessed = 0;

const run = async () => {
    const startOrderManagerQueue = Date.now();
    const promises = [];
    for (let i = 0; i < totalRequests; i++) {
        promises.push(axios.post(queueUrl, generateReuqestBody(), {
            headers
        }).then(({data}) => {
            orderManagers.push(data);
        }));
    }
    await Promise.all(promises);
    const endOrderManagerQueue = Date.now();

    console.log(`Total time Queue: ${endOrderManagerQueue - startOrderManagerQueue}ms`);
    console.log(`Average time Queue: ${(endOrderManagerQueue - startOrderManagerQueue) / totalRequests}ms`);

    // internal dispatch to force start processing
    await axios.get(startProcessingUrl)

    const startOrderManagerProcessing = Date.now();

    while (orderManagers.some(orderManager => orderManager.state !== 'completed')) {
        console.log('Processing Order Managers...');

        const randomOrderManagers = 
            orderManagers.filter(orderManager => orderManager.state !== 'completed')
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        for (const index in randomOrderManagers) {
            if (Object.hasOwnProperty.call(orderManagers, index)) {
                const getUrl = `${queueUrl}/${randomOrderManagers[index].id}`

                const { data } = await axios.get(getUrl, {
                    headers
                });

                if (data.state === 'completed') {
                    const orderManagerIndex = orderManagers.findIndex(orderManager => orderManager.id === data.id);
                    orderManagers[orderManagerIndex].state = 'completed';
                    managersProcessed += 1;
                }
            }
        }

        console.log(`Order Managers Processed: ${managersProcessed}/${totalRequests}`);
    }

    const endOrderManagerProcessing = Date.now();
    console.log(`Total time Processing: ${endOrderManagerProcessing - startOrderManagerProcessing}ms`);
    console.log(`Average time Processing: ${(endOrderManagerProcessing - startOrderManagerProcessing) / totalRequests}ms`);
}

run();
