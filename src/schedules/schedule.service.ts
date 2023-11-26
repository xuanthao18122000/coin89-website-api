// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import axios from 'axios';
// import { Market } from 'src/database/entities';
// import { Repository } from 'typeorm';

// @Injectable()
// export class ScheduleService {
//   constructor(
//     @InjectRepository(Market)
//     private readonly marketRepo: Repository<Market>,
//   ) {}

//   // @Cron(CronExpression.EVERY_30_SECONDS)
//   async handleCron() {
//     const response = await axios.get(
//       `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=100&limit=100&sortBy=market_cap&sortType=desc&convert=USD,BTC,ETH&cryptoType=all&tagType=all&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap`
//     );
//     const cryptoCurrencies = response.data.data.cryptoCurrencyList;
//     return cryptoCurrencies
//     for(let item of cryptoCurrencies) {

//     }

//   }

// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Market } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepo: Repository<Market>,
  ) {}

  // @Cron(CronExpression.)
  async handleCron() {
    console.log('=== Start Cron Job ===');

    const url = 'https://www.coingecko.com';
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.77',
        'X-Requested-With': 'XMLHttpRequest',
        Host: 'coingecko.com',
      },
    });

    const $ = cheerio.load(data);
    let listCoin: any[] = [];

    // // Sau khi cuộn xuống, bạn có thể sử dụng Cheerio để crawl dữ liệu từ table như bạn đã làm trước đó

    $('table > tbody > tr ').each((index, element) => {
      console.log(index);
      const id = this.extractNumberFromString(
        $(element).find('td:nth-child(2)').text(),
      );
      const { name, key } = this.extractNameAndKeyFromString(
        $(element).find('td:nth-child(3) > a > div').html(),
      );
      const logo = this.getUrlImage($(element).find('td:nth-child(3) > a').html());
      const price = this.urlCut($(element).find('td:nth-child(5)').html());
      const oneHour = this.extractNumberAndString($(element).find('td:nth-child(6) > span').html());
      const oneDay = this.extractNumberAndString($(element).find('td:nth-child(7) > span').html());
      const oneWeek = this.extractNumberAndString($(element).find('td:nth-child(8) > span').html());
      const volume24h = this.urlCut($(element).find('td:nth-child(10)').html());
      const marketCap = this.urlCut($(element).find('td:nth-child(11)').html());
      const last7days = this.extractLinkFromHTML($(element).find('td:nth-child(14)').html());

      listCoin.push({
        id,
        logo,
        name,
        key,
        price,
        oneHour,
        oneDay,
        oneWeek,
        volume24h,
        marketCap,
        last7days,
      });
      console.log(listCoin);
    });

  }

  extractNumberFromString(inputString: string) {
    const regex = /\d+/; // Biểu thức chính quy để tìm các chữ số (\d+)
    const match = inputString.match(regex); // Tìm các số trong chuỗi

    if (match && match.length > 0) {
      const number = parseInt(match[0], 10); // Chuyển chuỗi số thành số nguyên
      return number;
    } else {
      return null; // Trả về null nếu không tìm thấy số trong chuỗi
    }
  }

  extractNameAndKeyFromString(htmlString: string) {
    const $ = cheerio.load(htmlString);

    // Tìm thẻ div chứa thông tin name và key
    const divContent = $('div[data-view-component="true"]')
      .contents()
      .filter(function () {
        return this.nodeType === 3 && this.nodeValue.trim() !== ''; // Lọc các nút văn bản không trống
      });

    // Lấy thông tin name và key
    const name = divContent.eq(0).text().trim();
    const key = divContent.eq(1).text().trim();

    return { name, key };
  }

  extractLinkFromHTML(htmlString: string) {
    const $ = cheerio.load(htmlString);
  
    // Tìm thẻ img và lấy giá trị của thuộc tính src
    const src = $('img').attr('src');
  
    return src || null; // Trả về giá trị của thuộc tính src hoặc null nếu không tìm thấy
  }

  extractNumberAndString(inputString: string) {
    // Sử dụng biểu thức chính quy để tìm số và chuỗi từ chuỗi đầu vào
    const regex = /(?:<i class="fas fa-fw fa-caret-(down|up)"><\/i>)(\d+(\.\d+)?%)/;
    const match = inputString?.match(regex);
  
    if (match && match.length >= 3) {
      const data = String(parseFloat(match[2])); // Chuyển chuỗi số thành số thực
      const fluctuation = match[1]; // Chuỗi 'down' hoặc 'up'
      return { data, fluctuation };
    } else {
      return { data: null, fluctuation: null }; // Trả về giá trị mặc định nếu không tìm thấy thông tin
    }
  }

  getUrlImage(htmlString: string) {
    // Sử dụng regular expression để tìm chuỗi nằm trong src=""
    const srcValue = htmlString.match(/src="(.*?)"/);

    // Lấy phần giá trị của thuộc tính src từ kết quả của regular expression
    return srcValue ? srcValue[1] : null;
  }

  urlCut(htmlString: string) {
    // Sử dụng regular expression để tìm chuỗi giữa dấu ">" và "</"
    const textInsideTag = htmlString.match(/>(.*?)<\//g);

    // Lấy phần text được cắt từ kết quả của regular expression
    return textInsideTag[0].slice(1, -2)
      ? textInsideTag[0].slice(1, -2)
      : textInsideTag[0]; // Cắt bỏ ký tự ">" ở đầu và ký tự "</" ở cuối
  }
}
