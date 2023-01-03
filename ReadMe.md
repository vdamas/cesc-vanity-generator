# Cryptoescudo Vanity address (wallet) generator
# The address generation uses 
```
https://github.com/tboydston/hdAddressGenerator
```
# The single thread and multithread logic is based on
```
https://github.com/WietseWind/xrp-vanity-generator
```
#### Make sure you have **nodejs** installed on your computer
#### Clone this repository, enter directory and execute

```
npm install
```
#### Single thread, looking for `aaa` or `bbb`:

```
node cesc-vanity.js aaa bbb
```

#### `4` threads, looking for `ccc` or `ddd`:

```
node index.js 4 ccc ddd
```

