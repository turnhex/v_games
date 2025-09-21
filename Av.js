const elr = document.querySelector('div.bets-widget-container');
if (elr && elr.attributes.length > 0) {
    elr.removeAttribute(elr.attributes[0].name);
}

const el = document.querySelector('div.bets-widget-container');

if (el) {
   el.setAttribute('_ngcontent-rni-c200', '');
    console.log('Attribute changed to _ngcontent-rni-c200');
}

document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML = '<div class="gameInformation"> </div>'




const setting = {
    'winnPatternSize':3,
    'faildPatternSize':3,
}


const PatternWins = [
    [2,2,5]
]

const PatternFaild = [
    [2,1,1]
]

const PatternBoth = [


]

//globalList = []
globalList = []
        

for(let x=0; x<20; x++){
    
    console.log('<div class="result">', x, '</div>')
}


function updatePattern(incw,decw, incf,decf){
    if(incw == 1){
        setting.winnPatternSize++
    }else {
        if(decw == 1)
            if(setting.winnPatternSize > 0){
                setting.winnPatternSize--
        }
    }

    if(incf == 1){
        setting.faildPatternSize++
    }else{
        if(decf == 1){
            setting.faildPatternSize--
        }
    }
    lastProcess()
}

function Menu(){
    document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="menu_custome"> </div>'

    let tag = document.getElementsByClassName("menu_custome")[0]

    html = `
        <div>
            <center>
                Faild And Winn Size

                <div><button onclick="updatePattern(0,0,0,1)">-</button> `+setting.faildPatternSize+` <button onclick="updatePattern(0,0,1,0)">+</button></div>
                <div><button onclick="updatePattern(0,1,0,0)">-</button> `+setting.winnPatternSize+` <button onclick="updatePattern(1,0,0,0)">+</button></div>
            </center>
        </div>
        
        `
    tag.innerHTML = html
}


function data_to_1_2(data){

    let r = []
    for(let x=0; x<data.length; x++){
        if(data[x] < 2 ){
            r.push(1)
        }else{
            r.push(2)
        }
    }

    return r
}

function WinnFaildPattern(data){
    let winnPattern     = []
    let faildPattern    = []

    let winCounter = 0
    let faildCounter = 0

    for(let x=0; x<data.length; x++){
        if(data[x] < 2){
            faildCounter++
        }else{
            if(faildCounter > 0){
                faildPattern.push(faildCounter)
                faildCounter = 0
            }
        }

        if(data[x] > 1.99 ){
            winCounter++
        }else{
            if(winCounter > 0){
                winnPattern.push(winCounter)
                winCounter = 0
            }
        }
    }
    //console.log('winnPattern  : ', winnPattern)
    //console.log('faildPattern : ', faildPattern)

    return {'winnPattern':winnPattern, 'faildPattern':faildPattern}

}

function autoBet(){
/*
const PatternWins = [
    [2,1,5]
]

const PatternFaild = [
    [2,1,1]
]

const PatternBoth = [


]
*/

}


function customeRound(n){

    const n_str = n.toString().split(".")

    let decimal = '0'
    if(n_str.length > 1)
        decimal = n_str[1][0] ? n_str[1][0] : '0'

    //console.log('decimal', decimal)
    let n_new_str = n_str[0] + '.' + decimal + '0'
    return parseFloat(n_new_str)

}




function oddHistoryTable(){
    return 0
    document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="oddHistoryTable"> </div>'
    let tag = document.getElementsByClassName("oddHistoryTable")[0]

    let FaildData = WinnFaildPattern(globalList).faildPattern.slice(0, 18)
    let WinData = WinnFaildPattern(globalList).winnPattern.slice(0, 18)

    let currentOdd = globalList[0]

    let count = 0
    let oddHistoryTable_str = '<br><table border="1px solid" width=100%><body>'
    for(let x=1; x<globalList.length; x++){
        if(customeRound(currentOdd) == customeRound(globalList[x]) ){
            count++
            let color = ''
            let colorCurrentOdd = ''
            let index = ''

            if(x > 57){
               // index = 'style="color:green"'
            }

            if(currentOdd == globalList[x])
                colorCurrentOdd = 'style="color:green"'

            if(globalList[x-1] > 1.99)
                color = 'style="color:green"'
            //oddHistoryTable_str += '<tr><td>'+x.toString()+'</td><td>'+ customeRound(currentOdd).toString() +'/'+globalList[x].toString() + '</td> <td '+color+'>'+ globalList[x-1].toString()+ '</td></tr>'
            oddHistoryTable_str += '<tr><td '+index+'>'+x.toString()+'</td><td '+colorCurrentOdd+'>'+ globalList[x].toString() + '</td> <td '+color+'>'+ globalList[x-1].toString()+ '</td></tr>'
            

        }
        if(count > 10)
            break
    }
    if(count < 10)
        for(let x=count; x<10; x++){
            oddHistoryTable_str += '<tr><td><center>?</center></td> <td><center>?</center></td> <td><center>?</center></td></tr>'
        }
        
    oddHistoryTable_str += '</body></table>'

    let infoFaildPatternHappen = ''
    if(globalList[0] < 1.99){ //current game on faild
        if(FaildData[0]+1 === FaildData[2] && FaildData[1] === FaildData[3]){
            infoFaildPatternHappen = `<div style="border:1px solid gray"> <h5 style="color:green"> Faild Pattern Happen `+FaildData.slice(0, 4)+`</h5></div>`
          
        }
    }
    
    if(globalList[0] > 1.99){ //current game on faild
        if(WinData[0]+1 === WinData[2] && WinData[1] === WinData[3]){
            infoFaildPatternHappen = `<div style="border:1px solid gray"> <h5 style="color:green"> Win Pattern Happen `+WinData.slice(0, 4)+`</h5></div>`
          
        }
    }
    
    
    


    tag.innerHTML = infoFaildPatternHappen+oddHistoryTable_str
}


function oddPatternPrivius(){

   

    document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML = '<div class="oddPatternPrivius" style="font-size:13px; padding-left:5px"> </div>'
    let tag = document.getElementsByClassName("oddPatternPrivius")[0]

    //let tag = document.getElementsByClassName("gameInfo")[0]
    
    let priviusSmallOdd = ''
    let priviusLargOdd = ''

    let count = 0
    for(let x=0; x<globalList.length; x++){
        if(globalList[x] < 2){
            priviusSmallOdd += '<span style="color:red">'+globalList[x].toString()+ '</span>, '
        count++
        }
        if(count > 9)
            break
    }
    
    count = 0
    for(let x=0; x<globalList.length; x++){
        
        if(globalList[x] > 1.99){
            let style = 'style="color: rgb(145, 62, 248);"'
            if(globalList[x] < 3)
                style='style="color: rgba(180, 163, 171, 1);"'
            if(globalList[x] > 9.99)
                style='style="color: rgb(192, 23, 180);"'
            priviusLargOdd  += '<span '+style+'>'+globalList[x].toString()+ '</span>, '
            count++
        }
        if(count >= 9)
            break
    }
    

    let FaildData = WinnFaildPattern(globalList).faildPattern.slice(0, 15)
    let FaildP_str = ''
    let counter = 0
    for(let x=0; x<FaildData.length; x++){
        FaildP_str += FaildData[x].toString() + ','
        counter++
        if(counter >= setting.faildPatternSize){
            FaildP_str += " - "
            counter = 0
        }
    }

    let WinData = WinnFaildPattern(globalList).winnPattern.slice(0, 15)
    let WinP_str = ''
    counter = 0
    for(let x=0; x<WinData.length; x++){
        WinP_str += WinData[x].toString() + ','
        counter++
        if(counter >= setting.winnPatternSize){
            WinP_str += " - "
            counter = 0
        }
    }


    html = '<br><div class="oddPatternPrivius" style="font-size:14px"> <div>'+priviusSmallOdd+'</div>'+'<div>'+priviusLargOdd+'</div></div></br>'
    html += `<div style="font-size:15px">Faild P `+FaildP_str+'</div>'
    html += `<div style="font-size:15px">Winn P `+WinP_str+'</div></br>'
    
    tag.innerHTML = html

    tag = document.getElementsByClassName("gameInfo")[0]

    //console.log(WinnFaildPattern(globalList))
}


function pridict(){

    const faildPattern = WinnFaildPattern(globalList).faildPattern
    const winnPattern  = WinnFaildPattern(globalList).winnPattern

    console.log("faildPattern ", faildPattern)
    console.log("winnPattern ",  winnPattern)


    let currentFpatter = faildPattern.slice(1,3)
    let currentWpatter = winnPattern.slice(1,3)

    console.log("currentFpatter ", currentFpatter)
    console.log("currentWpatter ", currentWpatter)


    let failPrivius = []
    let failNext = []


    for(let x=2; x<faildPattern.length; x++){
        failPrivius.push(faildPattern[x])

        if(failPrivius.length === 2 ){
            //console.log("failPrivius ", failPrivius)
                            
            if(failPrivius.toString() === currentFpatter.toString()){
                //console.log("Found At ", x, " ->  Next : ", faildPattern[x-2], " current P : ", faildPattern[x-1], faildPattern[x])
                failNext.push(faildPattern[x-2])
            }

            failPrivius = []
            x--
        }
    }
    console.log("Faild Next : ", failNext)


    
    let winnPrivius = []
    let winnNext = []


    for(let x=2; x<winnPattern.length; x++){
        winnPrivius.push(winnPattern[x])

        if(winnPrivius.length === 2 ){
            //console.log("winnPrivius ", winnPrivius)
                            
            if(winnPrivius.toString() === currentWpatter.toString()){
                //console.log("Found At ", x, " ->  Next : ", winnPattern[x-2], " current P : ", winnPattern[x-1], winnPattern[x])
                winnNext.push(winnPattern[x-2])
            }



            winnPrivius = []
            x--
        }
    }
    console.log("winnNext Next : ", winnNext)
    


    if(winnNext.length == 0)
        winnNext = ["not Found"]
    if(failNext.length == 0)
        failNext = ["not Found"]
    
    //

    
    document.getElementsByClassName("data-list ng-star-inserted")[0].innerHTML += '<div class="pridiction"> </div>'
    let tag = document.getElementsByClassName("pridiction")[0]



    html = `<div style="font-size:15px">Pridict F : <span style="color:red">[`+faildPattern.slice(0,3).toString()+`]</span> : `+failNext.slice(0,13).toString()+'</div></br>'
    html += `<div style="font-size:15px">Pridict W : <span style="color:green">[`+winnPattern.slice(0,3).toString()+`]</span> : `+winnNext.slice(0,13).toString()+'</div></br>'

    //html += winnPattern.toString()

    let currentFpatterNew = failNext.slice(1,3)
    let currentWpatterNew = winnNext.slice(1,3)

    let nextF = []
    if(currentFpatterNew.length > 1){
        let groupF = []
       
        for(let x=0; x<failNext.length; x++){
            groupF.push(failNext[x])

            if(failNext.length === 2){

                if(currentFpatterNew.toString() === groupF.toString()){
                    nextF.push(failNext[x-2])
                }
                groupF = []
                x--
            }

        }
    }

    let nextW = []
    if(currentWpatterNew.length > 1){
        let groupW = []
       
        for(let x=0; x<winnNext.length; x++){
            groupW.push(winnNext[x])

            if(winnNext.length === 2){

                if(currentWpatterNew.toString() === groupW.toString()){
                    nextW.push(winnNext[x-2])
                }
                groupW = []
                x--
            }

        }
    }



    html += `<div>Next F : <b style="color:red">`+nextF.toString()+`</b></div>`

    html += `<div>Next W : <b style="color:green">`+nextW.toString()+`</b></div>`


    tag.innerHTML = html



}


function lastProcess(){
    
    const current12Format = data_to_1_2(globalList.slice(0,3))
    console.log('current12Format ', current12Format, globalList.slice(1,3))
    const data12Format = data_to_1_2(globalList)
    console.log(data12Format)

    


    function findPatternInDate(search_pattrn , data){

        let foundPatternIndexPosition = []

        for(let x=0; x<data.length; x++){
            let data_current_pattern = data.slice(x, x+3)

            
            if(search_pattrn.toString() === data_current_pattern.toString()){
                foundPatternIndexPosition.push(x)
                
                console.log('compare ',x, search_pattrn.toString(), data_current_pattern.toString())

            }
        }

        return foundPatternIndexPosition
    }

    const foundPatternIndexPosition = findPatternInDate(current12Format, data12Format)

    console.log('findPatternInDate ', foundPatternIndexPosition)

    foundPatternIndexPosition.forEach(x => {
        
        if(x != 0){
            let d = globalList.slice(x, x+3)
            console.log('find index : ',x,'->',x+3,' = ', d, ' so befor that : ', globalList[x-1])
        }
    });


    oddPatternPrivius()
    pridict()
    oddHistoryTable()
    
    Menu()

}

function getGlobalList(){


    let globalListHtml = document.getElementsByClassName("payout ng-star-inserted")
    console.log('globalListHtml', globalListHtml)

    let tmpGlobalList = []
    for(let x=0; x<globalListHtml.length; x++){
        
        tmpGlobalList.push(parseFloat(globalListHtml[x].innerText.replace('x', '')))
        
    }

    if(globalList.length === 0 ){
        console.log('[+] globalList first time update')
        globalList = tmpGlobalList
    }else{
        console.log("update globalList ")
        console.log("Current results : ", tmpGlobalList)
        const positionSize = 4
        const globalListPosition = globalList.slice(0, positionSize)
        //console.log(globalListPosition)

        let positionIndexPosition = 0

        for(let x=0; x<tmpGlobalList.length; x++){
            let tmpGlobalLIstPosition = tmpGlobalList.slice(x, x+positionSize)
            //console.log('every position ', tmpGlobalLIstPosition)
           // console.log('compare ', globalListPosition.toString(), ' == ', tmpGlobalLIstPosition.toString())
            if(globalListPosition.toString() === tmpGlobalLIstPosition.toString()){
                console.log("Found Position ", tmpGlobalLIstPosition)
                positionIndexPosition = x
                x=tmpGlobalLIstPosition.length
                break;
            }
        }

        const newList = tmpGlobalList.slice(0, positionIndexPosition)
        console.log('new list : ', newList)
        console.log('positionIndexPosition : ', positionIndexPosition)

        const backupGlobalList = globalList
        globalList = newList
        globalList.push(...backupGlobalList)
        console.log("update globalList : ", globalList)
    }


    lastProcess()
    Menu()
    
    
    return 0


}


    

// Select the target element
const target = document.querySelector('div.payouts-block');

if (target) {
    // Create an observer instance
    const observer = new MutationObserver((mutationsList) => {
        getGlobalList()
    });

    // Observer configuration
    observer.observe(target, {
        attributes: true,       // Watch for attribute changes
        childList: true,        // Watch for child node additions/removals
        subtree: true,          // Watch all descendants
        characterData: true     // Watch text changes
    });

    console.log('Observation started on payouts-block div');
} else {
    console.warn('Target element not found');
}
