var partyType = [];

$(document).ready(function(){
    $('#go-cal').click(goCalculate);
	$('.glyphicon-plus').click(addNewMember);
	$(document).on('click', '.glyphicon-remove', removeMember);
});

function addNewMember()
{
    // copy the last member
    $('.row-data:last').clone().insertBefore($('#row-add'));
    reindex();
}

function removeMember()
{
    if ($('tr.row-data').length == 1) return;
    $(this).closest('tr.row-data').remove();
    reindex();
}

function reindex()
{
    $('.row-data').each(function(){
        $(this).find('td:eq(0) span').text($(this).index());
    });
}

function goCalculate()
{
    var total = eval($('#total').val());
    var donate = eval($('#donate').val());
    var members = $('tr.row-data');

    if (total == 0) return;
    if (members.length == 0) return;

    var totalBase = 0;
    var pDonate = total - donate;
    members.each(function(){
        var pBase = eval($(this).find('input.personal-base').val());
        var pDont = eval($(this).find('input.personal-donate').val());
        if (pBase == undefined) pBase = 1;
        if (pDont == undefined) pDont = 0;
        totalBase += pBase;
        pDonate -= pDont;
    });
    if (totalBase <= 0) totalBase = members.length;
    pDonate = pDonate / totalBase;
    members.each(function(){
        var pBase = eval($(this).find('input.personal-base').val());
        var pDont = eval($(this).find('input.personal-donate').val());
        if (pBase == undefined) pBase = 1;
        if (pDont == undefined) pDont = 0;
        $(this).find('input.cal-result').val(Math.round(pDonate * pBase + pDont));
    });
}