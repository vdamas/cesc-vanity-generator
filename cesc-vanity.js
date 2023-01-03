const HdAddGen = require('hdaddressgenerator')

const isSubprocess = typeof process.send !== 'undefined'
const lookFor = process.argv.slice(2).map(f => { 
  return f.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') 
})

if (!isSubprocess) {
  console.log('\x1b[36m%s\x1b[0m', 'Cryptoescudo Vanity Wallet Generator')
  console.log('\x1b[36m%s\x1b[0m', ' adapted from xrp-vanity-generator by @WietseWind (Twitter) /u/pepperew (Reddit)')
  console.log()
}

const run = async (id, match) => {
  const re = '^(C)(' + match.join('|') + ')(.+)$|^(C.+)(' + match.join('|') + ')$'
  const regexp = new RegExp(re, 'i')

  if (match.length > 0) {
    if (!isSubprocess) {
      console.log('Looking for wallet addresses with keywords at the start/end:')
      match.forEach(function (k) {
        console.log('   - ', k)
      })
      console.log(' ')
      console.log('For the geeks: testing regular expression: ')
      console.log('  ', re)
      console.log()
      console.log('\x1b[33m%s\x1b[0m', '-- Press Control C to quit --');
      console.log()
    }

    for (let i = 0;;i++) {

	  let mnemonic = await HdAddGen.generateMnemonic('english',128);
	  //console.log(mnemonic);
	  let bip44 = await HdAddGen.withMnemonic(mnemonic.mnemonic,false,"CESC")
	  
	  let addresses = await bip44.generate(100)
	  
	  addresses.forEach((address)=>{
		  const account = {
			path: address.path,
			address: address.address,
			pubKey: address.pubKey,
			privKey: address.privKey,
			mnemonic: mnemonic.mnemonic
		  }
		  
		  const test = regexp.exec(account.address)
		  //console.log(test)
		  if (test) {
			const matchedAddress = test[1] === undefined
			  ? test[4] + '\x1b[32m' + test[5] + '\x1b[0m'
			  : test[1] + '\x1b[32m' + test[2] + '\x1b[0m' + test[3]

			if (!isSubprocess) {
			  process.stdout.write("\n")
			console.log(` > Match: [ ${matchedAddress} ]`)
			console.log(JSON.stringify(account))
			} else {
			  process.send({ 
				match: {
					path: address.path,
					address: address.address,
					pubKey: address.pubKey,
					privKey: address.privKey,
					mnemonic: mnemonic.mnemonic
				},
				child: id,
				pid: process.pid
			  })
			}
		  } else {
			if (!isSubprocess) {
			  if (i % 100 === 0) process.stdout.write('.')
			  if (i % 1000 === 0) process.stdout.write("\r" + i + ' ')
			} else {
			  if (i % 100 === 0) process.send({ counter: 100, child: id, pid: process.pid })
			}
		  }
	  });
    }
  } else {
    console.log('Please enter one or more keywords after the script to search for.')
    console.log('Eg. "node ' + process.argv[1] + ' johndoe mywallet cesc"')
    console.log('')
    process.exit(0)
  }
}

if (!isSubprocess) {
  run(null, lookFor)
} else {
  process.on('message', msg => {
    run(msg.id, msg.lookFor)
  })
}