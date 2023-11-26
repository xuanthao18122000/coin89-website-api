import { Column, Entity } from 'typeorm';
import { IntIdEntity } from './base.entity';

@Entity('markets')
export class Market extends IntIdEntity {
  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', nullable: true })
  symbol: string;

  @Column({ type: 'varchar', name: 'change_percentage_24h', nullable: true })
  changePercentage24h: string;

  @Column({ type: 'varchar', nullable: true })
  suffix: string;

  @Column({ type: 'varchar', name: 'current_price', nullable: true })
  currentPrice: string;

  @Column({ type: 'varchar', name: 'market_cap', nullable: true })
  marketCap: string;

  @Column({ type: 'varchar', name: 'circulating_supply', nullable: true })
  circulatingSupply: string;

  @Column({ type: 'varchar', name: 'total_volume', nullable: true })
  totalVolume: string;

  static STATUS = {
    /** Đang hoạt động */
    ACTIVE: 1,
    /** Ngừng hoạt động */
    INACTIVE: -1,
    /** Khóa */
    LOCKED: -2,
  };

  static COLOR = {
    /** Xanh lam */
    DENIM: 1,
    /** Tím */
    VIOLET: 2,
    /** Màu cam */
    TANGERINE: 3,
  };

  constructor(data: Partial<Market>) {
    super();
    if (data) {
      this.id = data.id || null;
      this.key = data.key;
      this.name = data.name;
      this.rank = data.rank;
      this.image = data.image;
      this.symbol = data.symbol;
      this.suffix = data.suffix;
      this.marketCap = data.marketCap;
      this.totalVolume = data.totalVolume;
      this.currentPrice = data.currentPrice;
      this.circulatingSupply = data.circulatingSupply;
      this.changePercentage24h = data.changePercentage24h;
      this.updatedAt = data.updatedAt;
      this.createdAt = data.createdAt;
    }
  }

  serialize() {
    return {
      id: this.id,
      rank: this.rank,
      key: this.key,
      name: this.name,
      image: this.image,
      symbol: this.symbol,
      suffix: this.suffix,
      marketCap: this.marketCap,
      totalVolume: this.totalVolume,
      currentPrice: this.currentPrice,
      circulatingSupply: this.circulatingSupply,
      changePercentage24h: this.changePercentage24h,
    };
  }
}
