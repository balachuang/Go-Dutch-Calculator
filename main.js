$(document).ready(function(){
	$(document).on('click', '.glyphicon-plus', addNewMember);
	$(document).on('click', '.glyphicon-remove', removeMember);
	$(document).on('keyup', 'input', goCalculate);
	loadPartyType();
});

function loadPartyType()
{
    $(partyType).each(function(index, value){
        $('<li><a href="#" onclick="setParty(' + index + ')">' + value.typeName + '</a></li>').appendTo('#party-type-menu');
    });
}

function addNewMember()
{
    // copy the last member
    var thisRaw = $(this).closest('.row-data');
    thisRaw.clone().insertAfter(thisRaw);
    reindex();
    goCalculate();
}

function removeMember()
{
    if ($('tr.row-data').length == 1) return;
    $(this).closest('tr.row-data').remove();
    reindex();
    goCalculate();
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

    if (total == undefined) total = 0;
    if (donate == undefined) donate = 0;

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

    var totalPay = donate;
    members.each(function(){
        var pBase = eval($(this).find('input.personal-base').val());
        var pDont = eval($(this).find('input.personal-donate').val());
        if (pBase == undefined) pBase = 1;
        if (pDont == undefined) pDont = 0;
        var pay = Math.round(pDonate * pBase + pDont);
        totalPay += pay;
        $(this).find('input.cal-result').val(pay);
    });

    if (totalPay != total)
    {
        // let the last one change...
        var diff = total - totalPay;
        var lastPay = eval(members.last().find('input.cal-result').val());
        members.last().find('input.cal-result').val(lastPay + diff);
    }
}

function setParty(idx)
{
    if ($('tr.row-data').length > 1) $('tr.row-data:gt(0)').remove();
    for (var n=0; n<partyType[idx].members.length-1; ++n)
    {
        var firstRaw = $('tr.row-data:eq(0)');
        firstRaw.clone().insertAfter(firstRaw);
    }
    reindex();
    for (var n=0; n<partyType[idx].members.length; ++n)
    {
        var thisRaw = $('tr.row-data').eq(n);
        thisRaw.find('td:eq(0) input').val(partyType[idx].members[n].name);
        thisRaw.find('td:eq(1) input').val(partyType[idx].members[n].donate);
        thisRaw.find('td:eq(2) input').val(partyType[idx].members[n].base);
    }
    goCalculate();
}
