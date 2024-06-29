document.addEventListener('DOMContentLoaded', function () {
    const urlUsuario = 'https://api.github.com/users/ieiou';
    const urlRepos = 'https://api.github.com/users/ieiou/repos';

    // Atualiza as informações do perfil
    fetch(urlUsuario)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Erro: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(dados => {
            document.getElementById('foto').src = dados.avatar_url;
            document.getElementById('nomePerfil').textContent = dados.name || dados.login;
            document.getElementById('descricaoPerfil').textContent = dados.bio;
            document.getElementById('local').textContent = `Local: ${dados.location}`;
            document.getElementById('nome1').textContent = dados.name || dados.login;
            document.getElementById('pessoas').textContent = dados.followers;
            document.getElementById('numRepos').textContent = ` (${dados.public_repos})`;
            document.getElementById('cor1').textContent = `${dados.html_url}`
            document.getElementById('cor1').href = `${dados.html_url}`
            Blog.textContent = 'Sem site disponível';
            // }

            // Atualiza o nome do perfil na página repo.html
            document.getElementById('NomePerfilGithub').textContent = dados.name;
        })
        .catch(erro => {
            console.error('Falha ao obter dados do usuário:', erro);
        });

    // Função para criar elementos dos repositórios
    function criarElementoRepo(repo) {
        const coluna = document.createElement('div');
        coluna.className = 'col';

        const card = document.createElement('div');
        card.className = 'card';

        const corpoCard = document.createElement('div');
        corpoCard.className = 'card-body';

        const tituloCard = document.createElement('h5');
        tituloCard.className = 'card-title repo';

        const linkRepo = document.createElement('a');
        linkRepo.href = `repo.html?id=${repo.id}`;
        linkRepo.id = 'nomeRepo';
        linkRepo.textContent = repo.name;
        linkRepo.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `repo.html?id=${repo.id}`;
        });

        const textoCard = document.createElement('p');
        textoCard.className = 'card-text';
        textoCard.id = 'DescricaoRepo';
        textoCard.textContent = repo.description || 'Sem descrição disponível.';

        const iconeEstrela = document.createElement('i');
        iconeEstrela.className = 'bi bi-star-fill';
        iconeEstrela.textContent = ` ${repo.stargazers_count}`;

        const iconePessoa = document.createElement('i');
        iconePessoa.className = 'bi bi-person-fill ms-5 person2';
        iconePessoa.textContent = ` ${repo.watchers_count}`;

        tituloCard.appendChild(linkRepo);
        corpoCard.appendChild(tituloCard);
        corpoCard.appendChild(textoCard);
        corpoCard.appendChild(iconeEstrela);
        corpoCard.appendChild(iconePessoa);
        card.appendChild(corpoCard);
        coluna.appendChild(card);

        return coluna;
    }

    // Atualiza a lista de repositórios
    fetch(urlRepos)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Erro: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(repositorios => {
            const containerRepos = document.getElementById('repos-container');
            repositorios.forEach(repo => {
                const elementoRepo = criarElementoRepo(repo);
                containerRepos.appendChild(elementoRepo);
            });
        })
        .catch(erro => {
            console.error('Falha ao obter dados dos repositórios:', erro);
        });

    // Código específico para repo.html
    if (window.location.pathname.endsWith('repo.html')) {
        function obterIdRepoDaQueryString() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        const idRepo = obterIdRepoDaQueryString();
        if (!idRepo) {
            alert('ID do repositório não fornecido na URL.');
            return;
        }

        const urlRepo = `https://api.github.com/repositories/${idRepo}`;

        fetch(urlRepo)
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error(`Erro: ${resposta.status}`);
                }
                return resposta.json();
            })
            .then(repo => {
                document.getElementById('repoName').textContent = `Repositório: ${repo.name}`;
                document.getElementById('repoDescription').textContent = repo.description || 'Sem descrição disponível';
                document.getElementById('repoStars').textContent = ` ${repo.stargazers_count}`;
                document.getElementById('repoWatchers').textContent = ` ${repo.watchers_count}`;
                document.getElementById('repoCreationDate').textContent = new Date(repo.created_at).toLocaleDateString();
                document.getElementById('repoLanguage').textContent = repo.language || 'Não especificada';
                document.getElementById('repoLink').href = repo.html_url;
                document.getElementById('repoLink').textContent = repo.html_url;

                const containerTopicos = document.getElementById('repoTopics');
                repo.topics.forEach(topico => {
                    const elementoTopico = document.createElement('div');
                    elementoTopico.className = 'topico';
                    elementoTopico.textContent = topico;
                    containerTopicos.appendChild(elementoTopico);

                
                });
            })
            .catch(erro => {
                console.error('Falha ao obter dados do repositório:', erro);
            });

        // Atualiza o nome do perfil na página repo.html
        fetch(urlUsuario)
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error(`Erro: ${resposta.status}`);
                }
                return resposta.json();
            })
            .then(dados => {
                document.getElementById('NomePerfilGithub').textContent = dados.name;
            })
            .catch(erro => {
                console.error('Falha ao obter dados do usuário:', erro);
            });
    }


    fetch('http://localhost:5000/Noticias')
        .then(jsonServer => {
            if (!jsonServer.ok) {
                throw new Error(`Erro: ${jsonServer.status}`);
            }
            return jsonServer.json();
        })
        .then(noticias => {
            let nots = `
            <div class="carousel-item active">
            <a href="${noticias[0].LinkNoticia}">
            <h5>${noticias[0].TituloNoticia}</h5>
            <img src="${noticias[0].ImagemNoticia}" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <p>${noticias[0].DescricaoNoticia}</p>
            </div>
          </div>
          <div class="carousel-item">
            <a href="${noticias[1].LinkNoticia}">
            <h5>${noticias[1].TituloNoticia}</h5>
            <img src="${noticias[1].ImagemNoticia}" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <p>${noticias[1].DescricaoNoticia}</p>
            </div>
          </div>
          <div class="carousel-item">
            <a href="${noticias[2].LinkNoticia}">
            <h5>${noticias[2].TituloNoticia}</h5>
            <img src="${noticias[2].ImagemNoticia}" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
              <p>${noticias[2].DescricaoNoticia}</p>
            </div>
          </div> 
            <div class="carousel-item">
                <a href="${noticias[3].LinkNoticia}">
                <h5>${noticias[3].TituloNoticia}</h5>
                <img src="${noticias[3].ImagemNoticia}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <p>${noticias[3].DescricaoNoticia}</p>
                </div>
              </div>
            <div class="carousel-item">
                <a href="${noticias[4].LinkNoticia}">
                    <h5>${noticias[4].TituloNoticia}</h5>
                <img src="${noticias[4].ImagemNoticia}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                  <p>${noticias[4].DescricaoNoticia}</p>
                </div>
              </div>
            `
            document.getElementById('noticias').innerHTML = nots;
        })
        .catch(erro => {
            console.error('Falha ao obter dados do usuário:', erro);
        });
    
        fetch('https://api.github.com/users/victorschneider')
        .then(colega1 => {
            if(!colega1.ok){
                throw new Error(`Erro: ${colega1.status}`);
            }
            return colega1.json();
        })
        .then(vitor =>{
            let col1 = `
            <div class="col">
            <div class="">
            <a href="${vitor.html_url}">
              <img src="${vitor.avatar_url}" class="mx-auto" alt="${vitor.name}">
               <div class="card-body">
                <h5 class="card-title text-center">${vitor.name}</h5></a>
               </div>
             </div>
           </div>`
           document.getElementById('colega1').innerHTML = col1;
        })
        .catch(erro => {
            console.error('Falha ao obter dados do usuário:', erro);
        });
    
        fetch('https://api.github.com/users/chdbarbosa')
        .then(colega2 => {
            if(!colega2.ok){
                throw new Error(`Erro: ${colega2.status}`);
            }
            return colega2.json();
        })
        .then(christiano =>{
            let col2 = `
            <div class="col">
            <div class="">
            <a href="${christiano.html_url}">
              <img src="${christiano.avatar_url}" class="mx-auto" alt="${christiano.name}">
               <div class="card-body">
                <h5 class="card-title text-center">${christiano.name}</h5></a>
               </div>
             </div>
           </div>`
           document.getElementById('colega2').innerHTML = col2;
        })
        .catch(erro => {
            console.error('Falha ao obter dados do usuário:', erro);
        });
    
        fetch('https://api.github.com/users/Luis-Sampaio')
        .then(colega3 => {
            if(!colega3.ok){
                throw new Error(`Erro: ${colega3.status}`);
            }
            return colega3.json();
        })
        .then(luis =>{
            let col3 = `
            <div class="col">
            <div class="">
            <a href="${luis.html_url}">
              <img src="${luis.avatar_url}" class="mx-auto" alt="${luis.name}">
               <div class="card-body">
                <h5 class="card-title text-center">${luis.name}</h5></a>
               </div>
             </div>
           </div>`
           document.getElementById('colega3').innerHTML = col3;
        })
        .catch(erro => {
            console.error('Falha ao obter dados do usuário:', erro);
        });
});
