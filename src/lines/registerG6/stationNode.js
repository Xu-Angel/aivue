import G6 from '@antv/g6';

export default function () {
    G6.registerNode('pathNode', {
        draw(cfg, group) {
            const shape = group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    radius: 0,
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'path-node',
                draggable: false,
            });
            // 文字描述
            // group.addShape('text', {
            // attrs: {
            //     x: 0,
            //     y: 16,
            //     fill: '#333',
            //     fontSize: 14,
            //     textAlign: 'center',
            //     textBaseline: 'top',
            //     text: cfg.showName,
            // }
            // name: 'node-label',
            // zIndex: 4,
            // });

            group.sort();
            return shape;
        }
    });
}