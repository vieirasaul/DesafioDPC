$( document ).ready(function() {

    //Instancia a tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    //Esconde a tooltip do CEP depois de X segundos
    $(document).on('show.bs.tooltip', function (e) {
        setTimeout(function() {  
         $('#cep').tooltip('hide');
      }, 3000);
    });

    //Opções do tooltip
    $('#cep').tooltip({
        trigger: 'manual',
        title: 'CEP não encontrado.'
    });

    function clearCepData() {
        // Limpa valores da seção de dados do cep.
        $("#logradouro").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#estado").val("");
        $("#cep").val("");
    }  

    //Instancia as máscaras dos campos
    $('#cep').mask('00000-000'); 
    $('#estado').mask('AA');

    

    function getData(){
        //Nova variável "cep" somente com dígitos.
        var cep = $('#cep').val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "Carregando" enquanto consulta webservice.
                $("#logradouro").val("Carregando");
                $("#bairro").val("Carregando");
                $("#cidade").val("Carregando");
                $("#estado").val("Carregando");
                $("#cep").val("Carregando");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#logradouro").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#estado").val(dados.uf);
                        $("#cep").val(dados.cep);

                        
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.           
                        clearCepData();             
                        $('#cep').tooltip('show');                        
                    }
                });
            }
        }
    }
    
    //Chama a função de pegar dados do endereço quando o campo de CEP perde foco.
    $('#cep').blur(function(){
        getData();
    });


    //Função para pegar os dados de CEP e bairro, com base em logradouro, cidade e estado.
    function get(url) {

        $.get(url, function(dados) {

            if (!("erro" in dados)) {

            //Ao digitar rua, cidade e estado, a API do ViaCEP retorna vários arrays, o if abaixo chama o primeiro resultado caso existam múltiplos arrays
            if (Object.prototype.toString.call(dados) === '[object Array]') {
                var dados = dados[0];
            }

            $.each(dados, function(nome, info) {
                $('#' + nome).val(nome === 'cep' ? info.replace(/\D/g, '') : info).attr('info', nome === 'cep' ? info.replace(/\D/g, '') : info);
            });            

            } else {
                $('#cep').tooltip('show');   
            }

        });
    }

    //Ao digitar rua, cidade e estado, e tirar o foco de um desses campos, retorna as informações de CEP e Bairro
    $('#logradouro, #cidade, #estado').on('blur', function(e) {

        if ($('#logradouro').val() !== '' && $('#logradouro').val() !== $('#logradouro').attr('info') && $('#cidade').val() !== '' && $('#cidade').val() !== $('#cidade').attr('info') && $('#estado').val() !== '' && $('#estado').val() !== $('#estado').attr('info')) {

            $("#bairro").val("Carregando");            
            $("#cep").val("Carregando");

        get('https://viacep.com.br/ws/' + $('#estado').val() + '/' + $('#cidade').val() + '/' + $('#logradouro').val() + '/json/');
        }

    });

    
});