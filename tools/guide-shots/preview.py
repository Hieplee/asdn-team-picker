import json,sys
from PIL import Image, ImageDraw
meta=json.load(open('out/meta.json'))
keys=sys.argv[2:]; o=sys.argv[1]
ims=[]
for k in keys:
    im=Image.open(f'out/{k}-{o}.png').convert('RGB'); W,H=im.size; d=ImageDraw.Draw(im)
    for i,(n,(x,y,w,h)) in enumerate(meta[k][o].items(),1):
        d.rectangle((x*W/100,y*H/100,(x+w)*W/100,(y+h)*H/100),outline=(255,213,74),width=4); d.text((x*W/100+4,y*H/100+2),f"{i}:{n}",fill=(255,255,0))
    s=0.5 if o=='p' else 0.5
    ims.append(im.resize((int(W*s*(0.9 if o=="p" else 0.9)),int(H*s*(0.9 if o=="p" else 0.9)))))
cols=len(ims) if o=='p' else 2
rows=(len(ims)+cols-1)//cols
cw=max(i.width for i in ims); ch=max(i.height for i in ims)
sheet=Image.new('RGB',(cw*cols,ch*rows),'white')
for n,i in enumerate(ims): sheet.paste(i,((n%cols)*cw,(n//cols)*ch))
sheet.save('/tmp/prev.png'); print(sheet.size)
