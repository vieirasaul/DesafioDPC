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

    //Instancia a máscara do CEP
    $('#cep').mask('00000-000'); 

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

    //Chama a função de pegar dados do endereço ao clicar no botão de busca.
    $('#buscar').click(function(){
        getData();
    });

    
});