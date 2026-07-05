# Device Delete Transaction 修正内容

## 概要

感染症情報を `room_infections` テーブルで管理するようになったため、
機器削除時にも病室が空になった場合の後処理を追加した。

## 背景

従来は Room → Stock、Room →
Room（別患者）では患者情報・感染症情報を削除していたが、 Device Delete
は未対応だったため、病室最後の1台を削除しても `patient_name` と
`room_infections` が残る問題があった。

## Backend修正

### delete_device_transaction.py

削除対象Deviceを取得し、削除前に `room_id` を保持するよう変更。

### Stock Area機器

履歴作成 → Device削除 → 終了

Task削除は不要。

### Room機器

履歴作成 → Task削除 → Device削除 → Room内Device確認 → 0台なら
patient_name をクリア → room_infections を削除

## Frontend修正

deleteDeviceTransaction.ts に

-   setRooms
-   setRoomInfections

を追加。

削除後に

-   rooms
-   roomInfections

を再取得・再描画するよう修正。

これにより、病室最後の1台を削除した際、
患者名・感染症マークが即座にUIから消えるようになった。

## 業務ルール統一

病室内の機器が0台になった場合は、

-   patient_name をクリア
-   room_infections を削除

を

-   Room → Stock
-   Room → Room（別患者）
-   Device Delete

の全ルートで統一した。
