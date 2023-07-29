## Notices

### Bibliotecas

    const fs = require('fs');
    const pup = require('puppeteer');

fs

- interage com o sistema de arquivos do computador

- ex:    `fs.writeFileSync()`


puppeteer

- `controlar` o Chrome

- `simulando` um usuário

##

### Construção

Criei um função assíncrona para esperar a callback das funções do await, no caso dentro de um aplicação grande.


Listei as variáveis antes de iniciar o código, sendo: 


- `let c = 1;` contagem dos links de cada notícia
    
- `const list = [];`  cria lista para conseguir enviar e salvar as informações no JSONfile 
    
- `const url = 'https://olhardigital.com.br/'` link do site que vai ser obtido as infos


Apos isso, iniciei o código pelo pup, para conseguir atribuir todas as funcionalidades da aplicação que eu queria utilizar, pelo seguinte: 

- `const browser = await pup.launch({headless : false});` ou headless : true, pois ai não mostra a aplicação rodando diretamente para o cliente e sim, em segundo plano.
##
Logo a seguir abri o browser e iniciei uma funcionalidade para não ter tempo de expiração enquanto a página estiver rodando, sendo eles repectivamente:

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
##
Prosseguindo redirecionamos para a url do site mencionado

- `await page.goto(url);`

E visualizamos os links de cada notícia para podermos pegar as especificações de cada uma, pelo:

- `const noticias = await page.$$eval('a.cardV2.cardV2-incover', el => el.map(noticia => noticia.href));`
##
### Retirar os dados de cada notícia

Com ajuda do for, consegui ler cada link de noticia por vez para trazer os dados requisitados abaixo, assim lançando no array `obj` e puxar pela `list` todas as informações, através do método `push`.

#### Parâmetros do `for` e Indentificação das informações.

    for(const noticia of noticias) {
      if(c === 5) continue;
          console.log('page: ' + c);
      await page.goto(noticia);
      await page.waitForSelector('.banner.banner-noticia-destaque h1');
      await page.waitForSelector('.banner.banner-noticia-destaque .banner-excerpt');
##

#### Guardar as informações da notícias em variáveis.


        const title = await page.$eval('.banner.banner-noticia-destaque h1', element => element.innerText);
        const subject = await page.$eval('.banner.banner-noticia-destaque .banner-excerpt', element => element.innerText);
        const src = await page.evaluate(() => {
          const imageElement = document.querySelector('img.attachment-post-thumbnail.size-post-thumbnail.wp-post-image');
          return imageElement && imageElement.tagName === 'IMG' ? imageElement.src : null;
        
          });
##

#### Salvando as infos em um obj e puxando para uma lista Array.


        const obj = {};
          obj.title = title;
          obj.subject = subject;
          obj.src = src;
          obj.noticia = noticia;
            
        list.push(obj);
            
          c++;
    } // fechamento do for

#### Criação de um JSONfile para as informações de cada notícia e finalização da aplicação

    await browser.close(); // fechar a aba, quando terminar as requisições
    
      const listJSON = await JSON.stringify(list, null, 2); //transforma a lista em string juntamente com as configurações json
      
      await fs.writeFileSync('notice.json', listJSON); // cria o file com o nome notice.json, usando o writeFileSync, passando como parametro a configuração acima
        console.log('file create sucessfully'); // e tudo pronto
          return // return para via das dúvidas
        } catch (error) {
            console.log('Algo errado aconteceu, verifique com o suporte. Erro: '+error + '\n Prosseguimos tentando...');
            SerchNotices(); // caso der erro, a aplicação roda novamente
        }
    }

    SerchNotices(); // Rodar o código

Espero que tenham gostado 😃

